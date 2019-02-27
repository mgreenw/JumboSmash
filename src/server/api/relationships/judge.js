// @flow

import type { $Request } from 'express';
import type { Notification } from '../../expo/send-notifications';

const _ = require('lodash');

const {
  status,
  validate,
  asyncHandler,
  canAccessUserData,
} = require('../utils');
const utils = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');
const logger = require('../../logger');
const Socket = require('../../socket');
const Expo = require('../../expo');

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

const emojis = {
  smash: String.fromCodePoint(0x1F351),
  social: String.fromCodePoint(0x1F418),
  stone: String.fromCodePoint(0x1F343),
};

async function sendMatchNotification(
  userId: number,
  matchUserId: number,
  scene: string,
): Promise<Notification[]> {
  const matchResult = await db.query(`
    ${utils.matchQuery}
    AND me_critic.candidate_user_id = $2
    LIMIT 1
  `, [userId, matchUserId]);

  if (matchResult.rowCount === 0) {
    logger.error('No match found in attempt to send notification.');
    return [];
  }

  const [match] = matchResult.rows;

  // Send the notification over socket
  Socket.sendNewMatchNotification(userId, { match, scene });

  // Return the push notification information
  return [{
    userId,
    sound: 'default',
    body: `You have a new match! ${emojis[scene]}`,
    data: {
      userId,
    },
    badge: 1, // TODO: make this dynamic with the number of unread messages
  }];
}

async function checkMatch(userId: number, candidateUserId: number, scene: string) {
  try {
    const matchedResult = await db.query(`
      SELECT
        COALESCE(
          r_critic.liked_${scene}, false) AND COALESCE(r_candidate.liked_${scene},
          false
        ) AS matched
      FROM relationships r_critic
      LEFT JOIN relationships r_candidate
        ON r_candidate.critic_user_id = r_critic.candidate_user_id
        AND r_candidate.candidate_user_id = r_critic.critic_user_id
      WHERE r_critic.critic_user_id = $1 AND r_critic.candidate_user_id = $2
    `, [userId, candidateUserId]);

    // Check if the users are matched
    const matched = matchedResult.rowCount > 0 && matchedResult.rows[0].matched === true;
    if (matched) {
      const notifications = _.flatten(await Promise.all([
        sendMatchNotification(userId, candidateUserId, scene),
        sendMatchNotification(candidateUserId, userId, scene),
      ]));
      Expo.sendNotifications(notifications);
    }
  } catch (error) {
    logger.error('Failed to check for match', error);
  }
}

/**
 * @api {post} /api/relationships/judge
 *
 */
const judge = async (userId: number, scene: string, candidateUserId: number, liked: boolean) => {
  // NOTES:
  // 1) This query will fail if the candidate does not have a profile. We handle
  //    this specific error in the "catch" block
  // 2) If there is currently no relationship between the two users, a
  //    relationship will be inserted. If there is a relationship, the
  //    relationship will be updated with the desired values
  // 3) The 'last_swipe_timestamp' is always updated to reflect that the
  //    critic has interacted with the candidate
  try {
    await db.query(`
      INSERT INTO relationships (
        critic_user_id,
        candidate_user_id,
        liked_${scene},
        liked_${scene}_timestamp
      )
      VALUES (
        $1,
        $2,
        $3,
        CASE WHEN $3 THEN NOW() ELSE NULL END
      )
      ON CONFLICT (critic_user_id, candidate_user_id)
      DO UPDATE
        SET
        liked_${scene} = $3,
        last_swipe_timestamp = now(),
        liked_${scene}_timestamp = CASE WHEN $3 THEN NOW() ELSE NULL END
    `, [userId, candidateUserId, liked]);

    if (liked) {
      checkMatch(userId, candidateUserId, scene);
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
