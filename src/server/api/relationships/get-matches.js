// @flow

import type { $Request } from 'express';

const db = require('../../db');
const apiUtils = require('../utils');
const { profileSelectQuery } = require('../users/utils');
const utils = require('./utils');
const codes = require('../status-codes');

const matchedScenesSelect = utils.scenes.map((scene) => {
  return `
    CASE
      me_critic.liked_${scene} AND they_critic.liked_${scene}
      WHEN true
        THEN GREATEST(me_critic.liked_${scene}_timestamp, they_critic.liked_${scene}_timestamp)
        ELSE NULL
    END`;
});

const matchedScenesChecks = utils.scenes.map((scene) => {
  return `(me_critic.liked_${scene} AND they_critic.liked_${scene})`;
});

const sceneTimestampList = utils.scenes.map((scene) => {
  return `me_critic.liked_${scene}_timestamp, they_critic.liked_${scene}_timestamp`;
});

const scenes = utils.scenes.map(scene => `'${scene}'`).join(',');

/**
 * @api {get} /api/relationships/matches
 *
 */
const getMatches = async (userId: number) => {
  // NOTES:
  // 1) We are selecting the user's profile as well as the scenes that the
  //    requesting user and the other user are matched on. We use a CASE statement
  //    defined in matchedScenesSelect in order to get the scenes where the match
  //    occurred. Then, we use array_remove() to remove all 'null' values (where
  //    the users are not matched)
  // 2) We do a join on relationships in order to get the inverse relationship.
  //    In this query, "me" represents the requesting user and "they" represents
  //    the user's relationships, IE the users that have a relationship with
  //    the requesting user. If there is no inverse, then there cannot be a match.
  // 3) We filter out all blocked users (if either person blocked the other)
  //    and also ensure that there exists at least one scene where both
  //    users liked the other (which means they have a match).
  const result = await db.query(`
    SELECT
      they_profile.user_id as "userId",
      ${profileSelectQuery('they_profile.user_id', { tableAlias: 'they_profile', buildJSON: true })} AS profile,
      json_object(ARRAY[${scenes}], ARRAY[
        ${matchedScenesSelect.join(',')}
      ]::text[]) AS scenes,
      CASE WHEN most_recent_message.message_id IS NULL
      THEN NULL
      ELSE json_build_object(
        'messageId', most_recent_message.message_id,
        'content', most_recent_message.content,
        'timestamp', most_recent_message.timestamp,
        'fromClient', most_recent_message.from_client
      ) END AS "mostRecentMessage"
    FROM relationships me_critic
    JOIN relationships they_critic
      ON they_critic.candidate_user_id = $1
      AND they_critic.critic_user_id = me_critic.candidate_user_id
    JOIN profiles they_profile
      ON they_profile.user_id = me_critic.candidate_user_id
    JOIN classmates them
      ON they_profile.user_id = them.id
    LEFT JOIN (
      SELECT DISTINCT ON (other_user_id) *
      FROM (
        SELECT
          id AS message_id,
          content,
          timestamp,
          (sender_user_id = $1) AS from_client,
          CASE WHEN sender_user_id = $1 THEN receiver_user_id ELSE sender_user_id END AS other_user_id
        FROM   messages
        WHERE  $1 in (sender_user_id, receiver_user_id)
        ) most_recent_messages
      ORDER BY other_user_id, timestamp DESC
    ) AS most_recent_message ON most_recent_message.other_user_id = they_profile.user_id
    WHERE
      NOT them.banned
      AND me_critic.critic_user_id = $1
      AND me_critic.candidate_user_id = they_critic.critic_user_id
      AND (me_critic.blocked IS NOT true AND they_critic.blocked IS NOT TRUE)
      AND
        (${matchedScenesChecks.join(' OR ')})
    ORDER BY
      most_recent_message.timestamp NULLS FIRST,
      GREATEST(${sceneTimestampList.join(',')}) DESC
  `, [userId]);

  return apiUtils.status(codes.GET_MATCHES__SUCCESS).data(result.rows);
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getMatches(req.user.id);
  }),
];

module.exports = {
  handler,
  apply: getMatches,
};
