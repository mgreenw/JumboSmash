// @flow

import type { $Request } from 'express';

const _ = require('lodash');

const db = require('../../db');
const apiUtils = require('../utils');
const utils = require('./utils');
const { profileSelectQuery } = require('../users/utils');
const codes = require('../status-codes');
const logger = require('../../logger');

/**
 * @api {get} /api/relationships/candidates/:scene
 *
 */
const getSceneCandidates = async (
  userId: number,
  scene: string,
  exclude: number[],
  resetCandidates: boolean = false,
) => {
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

  // If the resetCandidates flag is set, reset all non-liked candidates in this scene.
  if (resetCandidates) {
    logger.debug(`Resetting candidates for user ${userId} in ${scene}`);
    await db.query(`
      UPDATE relationships
      SET swiped_${scene}_timestamp = NULL
      WHERE
        critic_user_id = $1
        AND liked_${scene} IS FALSE
    `, [userId]);
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
  //   6) There is no risk of SQL injection by directly inserting userId:
  //      that value is generated server side and there is no way to get here
  //      without it being a valid user id
  //   7) We exclude all users indicated by a 'exclude[]=<user_id>' query
  //      parameter in the request
  //   8) The RANDOM() order at the end is thought to be slow on big tables.
  //      However, since that is done last and there is a max of about 1000
  //      rows, we should be gucci!
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
      candidate.can_be_swiped_on AND
      NOT COALESCE(r_critic.blocked, false) AND
      NOT COALESCE(r_candidate.blocked, false) AND
      NOT COALESCE(r_critic.liked_${scene}, false) AND
      r_critic.swiped_${scene}_timestamp IS NULL
      ${isSmash ? `AND (
        (critic.want_he AND candidate.use_he) OR
        (critic.want_she AND candidate.use_she) OR
        (critic.want_they AND candidate.use_they)
      ) AND (
        (candidate.want_he AND critic.use_he) OR
        (candidate.want_she AND critic.use_she) OR
        (candidate.want_they AND critic.use_they)
      )` : ''}
    ORDER BY RANDOM()
    LIMIT 20
  `, [userId, excludedUsers]);

  return apiUtils.status(codes.GET_SCENE_CANDIDATES__SUCCESS).data(_.shuffle(result.rows));
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return getSceneCandidates(req.user.id, req.params.scene, req.query.exclude, req.query['reset-candidates'] !== undefined);
  }),
];

module.exports = {
  handler,
  apply: getSceneCandidates,
};
