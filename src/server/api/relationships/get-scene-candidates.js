// @flow

import type { $Request } from 'express';

const _ = require('lodash');

const db = require('../../db');
const apiUtils = require('../utils');
const utils = require('./utils');
const { profileSelectQuery } = require('../users/utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/relationships/candidates/:scene
 *
 */
const getSceneCandidates = async (userId: number, scene: string, exclude: number[]) => {
  // Generate a list of excluded users
  // If the excluded params are not valid, return an error.
  let excludedUsers = [];
  if (exclude) {
    // Ensure the exclude params are an array
    if (!Array.isArray(exclude)) {
      return apiUtils.status(codes.BAD_REQUEST).data({
        message: 'Exclude paramaters recieved as a non-array. Use "exclude[]=..."',
      });
    }

    // Parse the input parameters to integers
    excludedUsers = _.map(exclude, idString => Number.parseInt(idString, 10));

    // Ensure all excluded users are integers. If not, error.
    if (_.includes(excludedUsers, NaN)) {
      return apiUtils.status(codes.BAD_REQUEST).data({
        message: 'Exclude parameters includes a non-integer',
      });
    }
  }

  // Ensure the scene is valid.
  if (!utils.sceneIsValid(scene)) {
    return apiUtils.status(codes.GET_SCENE_CANDIDATES__INVALID_SCENE).noData();
  }

  const isSmash = scene === 'smash';

  // Query for candidates!
  // NOTES:
  //   1) We have a slightly different query in the 'smash' scene. In this case,
  //      we additionally check if the critic and candidates pronouns match up.
  //   2) We ALWAYS check if the candidate is blocked by the critic
  //   3) We ALWAYS check if the critic has already liked the candidate
  //   4) We ALWAYS check if the candidate is active in the scene
  //   5) We limit to 10 results - the results should change as the user
  //      swipes, so we can always just get the first 10
  //   6) We order by "last_swipe_timestamp" - we want the user to see people
  //      they haven't seen recently
  //   7) There is no risk of SQL injection by directly inserting userId:
  //      that value is generated server side and there is no way to get here
  //      without it being a valid user id
  //   8) We exclude all users indicated by a 'exclude[]=<user_id>' query
  //      parameter in the request
  const result = await db.query(`
    SELECT
      profile.user_id AS "userId",
      ${profileSelectQuery('profile.user_id', { tableAlias: 'profile', buildJSON: true })} AS profile
    FROM profiles profile
    JOIN users candidate on candidate.id = profile.user_id
    LEFT JOIN relationships r_critic ON r_critic.critic_user_id = $1 AND r_critic.candidate_user_id = candidate.id
    LEFT JOIN relationships r_candidate ON r_candidate.critic_user_id = candidate.id AND r_candidate.candidate_user_id = $1
    ${isSmash ? 'JOIN users critic on critic.id = $1' : ''}
    WHERE
      NOT profile.user_id = ANY($2) AND
      profile.user_id != $1 AND
      candidate.active_${scene} AND
      NOT COALESCE(r_critic.blocked, false) AND
      NOT COALESCE(r_candidate.blocked, false) AND
      NOT COALESCE(r_critic.liked_${scene}, false)
      ${isSmash ? `AND (
        (critic.want_he AND candidate.use_he) OR
        (critic.want_she AND candidate.use_she) OR
        (critic.want_they AND candidate.use_they)
      )` : ''}
    ORDER BY r_critic.last_swipe_timestamp DESC NULLS FIRST
    LIMIT 10


  `, [userId, excludedUsers]);

  return apiUtils.status(codes.GET_SCENE_CANDIDATES__SUCCESS).data(result.rows);
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getSceneCandidates(req.user.id, req.params.scene, req.query.exclude);
  }),
];

module.exports = {
  handler,
  apply: getSceneCandidates,
};
