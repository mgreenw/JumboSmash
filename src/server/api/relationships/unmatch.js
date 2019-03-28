// @flow

import type { $Request } from 'express';

const { status, asyncHandler, canAccessUserData } = require('../utils');
const utils = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');

const sceneQuery = utils.scenes.map(scene => `liked_${scene} = false, swiped_${scene}_timestamp = NULL`);
/**
 * @api {post} /api/relationships/unmatch/:matchUserId
 *
 */
const unmatch = async (userId: number, matchUserId: number) => {
  // If the users are matched in a scene, unmatch them in that scene and require
  // both users to re-consent to the match
  const matched = await canAccessUserData(matchUserId, userId, { requireMatch: true });
  if (!matched || Number.isNaN(matchUserId)) {
    return status(codes.UNMATCH__NOT_MATCHED).noData();
  }

  await db.query(`
    UPDATE relationships
    SET ${sceneQuery.join(',')}
    WHERE critic_user_id = $1 AND candidate_user_id = $2
    OR critic_user_id = $2 AND candidate_user_id = $1
  `, [userId, matchUserId]);

  return status(codes.UNMATCH__SUCCESS).noData();
};

const handler = [
  asyncHandler(async (req: $Request) => {
    const matchUserId = Number.parseInt(req.params.matchUserId, 10);
    return unmatch(req.user.id, matchUserId);
  }),
];

module.exports = {
  handler,
  apply: unmatch,
};
