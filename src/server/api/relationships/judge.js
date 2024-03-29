// @flow

import type { $Request } from 'express';

const uuidv4 = require('uuid/v4');
const {
  status,
  validate,
  asyncHandler,
  canAccessUserData,
} = require('../utils');
const utils = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');
const redis = require('../../redis');
const logger = require('../../logger');
const Notifications = require('../../notifications');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "candidateUserId": {
      "type": "number",
      "multipleOf": 1 // This asserts that the javascript number is an integer
    },
    "scene": {
      "type": "string",
      "enum": utils.scenes,
    },
    "liked": {
      "type": "boolean"
    }
  },
  "required": ["candidateUserId", "scene", "liked"]
};
/* eslint-enable */

async function checkMatch(
  userId: number,
  candidateUserId: number,
  scene: string,
): Promise<boolean> {
  try {
    const matchedResult = await db.query(`
      SELECT
        COALESCE(
          r_critic.liked_${scene},
          false) AND COALESCE(r_candidate.liked_${scene},
          false
        ) AS matched
      FROM relationships r_critic
      LEFT JOIN relationships r_candidate
        ON r_candidate.critic_user_id = r_critic.candidate_user_id
        AND r_candidate.candidate_user_id = r_critic.critic_user_id
      WHERE r_critic.critic_user_id = $1 AND r_critic.candidate_user_id = $2
    `, [userId, candidateUserId]);

    // Check if the users are matched
    return matchedResult.rowCount > 0 && matchedResult.rows[0].matched === true;
  } catch (error) {
    logger.error('Failed to check for match', error);
    throw error;
  }
}

/**
 * @api {post} /api/relationships/judge
 *
 */
const judge = async (userId: number, scene: string, candidateUserId: number, liked: boolean) => {
  // There is also a db constraint to check this.
  if (userId === candidateUserId) {
    return status(codes.JUDGE__CANDIDATE_NOT_FOUND).noData();
  }

  // NOTES:
  // 1) This query will fail if the candidate does not have a profile. We handle
  //    this specific error in the "catch" block
  // 2) If there is currently no relationship between the two users, a
  //    relationship will be inserted. If there is a relationship, the
  //    relationship will be updated with the desired values
  try {
    const result = await db.query(`
      WITH old_liked AS (
        SELECT liked_${scene} AS liked
        FROM relationships
        WHERE critic_user_id = $1
          AND candidate_user_id = $2
      )
      INSERT INTO relationships (
        critic_user_id,
        candidate_user_id,
        liked_${scene},
        swiped_${scene}_timestamp
      )
      VALUES (
        $1,
        $2,
        $3,
        NOW()
      )
      ON CONFLICT (critic_user_id, candidate_user_id)
      DO UPDATE
        SET
        liked_${scene} = $3,
        swiped_${scene}_timestamp = NOW()
      RETURNING (SELECT * FROM old_liked)
    `, [userId, candidateUserId, liked]);

    // This represents if the critic already liked the candidate in the given scene
    const likedBefore = result.rowCount > 0 && result.rows[0].liked === true;

    // Send notifications!
    // If the user liked them this time but did not previously like
    // the candidate in this scene, check for a match.
    if (liked && !likedBefore) {
      const matched = await checkMatch(userId, candidateUserId, scene);
      if (matched) {
        // They are matched! Construct a system message.
        const matchMessage = `MATCHED_${scene.toUpperCase()}`;

        // Insert the system message
        const systemMessageResult = await db.query(`
          INSERT INTO messages
          (content, sender_user_id, receiver_user_id, unconfirmed_message_uuid, from_system)
          VALUES ($1, $2, $3, $4, true)
          RETURNING timestamp
        `, [matchMessage, userId, candidateUserId, uuidv4()]);

        // If the result here does not have one row it is a SERVER_ERROR;
        const { timestamp: sceneMatchMessageTimestamp } = systemMessageResult.rows[0];

        // Insert the message for both the sender and the receiver.
        // Note the reversal of the params.
        const timestamp = sceneMatchMessageTimestamp.toISOString();
        const [didMarkUnreadForJudger, didMarkUnreadForCandidate] = await Promise.all([
          redis.shared.insertMessage(
            redis.unreadConversationsKey(userId),
            candidateUserId.toString(),
            timestamp,
          ),
          redis.shared.insertMessage(
            redis.unreadConversationsKey(candidateUserId),
            userId.toString(),
            timestamp,
          ),
        ]);

        logger.debug(`Inserted system match for users ${userId} (updated: ${!!didMarkUnreadForJudger}) and ${candidateUserId} (updated: ${!!didMarkUnreadForCandidate})`);

        // Send the notifications! This will happen in the background
        // so execution here can proceed.
        Notifications.newMatch(userId, candidateUserId, scene);
      }
    }

    // If the query succeeded, return success
    return status(codes.JUDGE__SUCCESS).noData();
  } catch (err) {
    // If the query failed due to a voilation of the candidate_user_id fkey
    // into the profiles table, return a more specific error. See here:
    // https://www.postgresql.org/docs/10/errcodes-appendix.html
    if (err.code === '23503' && err.constraint === 'relationships_candidate_user_id_fkey') {
      return status(codes.JUDGE__CANDIDATE_NOT_FOUND).noData();
    }

    throw err;
  }
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    // NOTE: Admins get no special privileges here
    const canJudge = await canAccessUserData(req.body.candidateUserId, req.user.id);
    if (!canJudge) {
      return status(codes.JUDGE__CANDIDATE_NOT_FOUND).noData();
    }

    return judge(req.user.id, req.body.scene, req.body.candidateUserId, req.body.liked);
  }),
];

module.exports = {
  handler,
  apply: judge,
};
