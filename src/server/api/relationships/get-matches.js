// @flow

import type { $Request } from 'express';

const db = require('../../db');
const redis = require('../../redis');
const apiUtils = require('../utils');
const codes = require('../status-codes');
const utils = require('./utils');

const matchedScenesChecks = utils.scenes.map((scene) => {
  return `(me_critic.liked_${scene} AND they_critic.liked_${scene})`;
});

const sceneTimestampList = utils.scenes.map((scene) => {
  return `
    CASE WHEN me_critic.liked_${scene} AND they_critic.liked_${scene}
    THEN GREATEST(me_critic.swiped_${scene}_timestamp, they_critic.swiped_${scene}_timestamp)
    ELSE NULL
    END
  `;
});

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
  const [matchesResult, unreadConversationUserIds] = await Promise.all([
    db.query(`
      ${utils.matchQuery}
        AND me_critic.candidate_user_id = they_critic.critic_user_id
        AND NOT them.terminated
        AND (me_critic.blocked IS NOT true AND they_critic.blocked IS NOT TRUE)
        AND
          (${matchedScenesChecks.join(' OR ')})
      ORDER BY
        most_recent_message.timestamp DESC NULLS FIRST,
        GREATEST(${sceneTimestampList.join(',')}) DESC
    `, [userId]),
    redis.shared.hkeys(redis.unreadConversationsKey(userId)),
  ]);

  // Map the userIds into an object for much faster access
  const unreadConversationUserIdsMap = unreadConversationUserIds.reduce(
    (unreadUserIds, unreadUserId) => {
      /* eslint-disable no-param-reassign */
      unreadUserIds[unreadUserId] = true;
      /* eslint-enable no-param-reassign */
      return unreadUserIds;
    },
    {},
  );

  const matches = matchesResult.rows.map((match) => {
    return {
      ...match,
      conversationIsRead: !(match.userId in unreadConversationUserIdsMap),
    };
  });

  return apiUtils.status(codes.GET_MATCHES__SUCCESS).data(matches);
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
