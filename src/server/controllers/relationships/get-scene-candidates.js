// @flow

import type { $Request, $Response } from 'express';

const _ = require('lodash');

const db = require('../../db');
const apiUtils = require('../utils');
const utils = require('./utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/relationships/candidates/:scene
 *
 */
const getSceneCandidates = async (req: $Request, res: $Response) => {
  const { scene } = req.params;
  const { exclude } = req.query;

  let excludedUsers = [];
  if (exclude) {
    if (Array.isArray(exclude)) {
      excludedUsers = _.map(exclude, idString => Number.parseInt(idString, 10));
      if (_.includes(excludedUsers, NaN)) {
        return res.status(400).json({
          status: codes.BAD_REQUEST,
          message: 'Exclude parameters includes a non-integer',
        });
      }
    } else {
      return res.status(400).json({
        status: codes.BAD_REQUEST,
        message: 'Exclude paramaters recieved as a non-array. Use "exclude[]=..."',
      });
    }
  }

  // Ensure the scene is valid.
  if (!utils.sceneIsValid(scene)) {
    return res.status(400).json({
      status: codes.GET_SCENE_CANDIDATES__INVALID_SCENE,
    });
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
  //   7) There is no risk of SQL injection by directly inserting req.user.id:
  //      that value is generated server side and there is no way to get here
  //      without it being a valid user id
  //   8) We exclude all users indicated by a 'exclude[]=<user_id>' query
  //      parameter in the request

  try {
    const result = await db.query(`
      SELECT
        profile.user_id as "userId",
        profile.display_name AS "displayName",
        to_char(profile.birthday, 'YYYY-MM-DD') AS birthday,
        profile.bio,
        profile.image1_url AS "image1Url",
        profile.image2_url AS "image2Url",
        profile.image3_url AS "image3Url",
        profile.image4_url AS "image4Url"
      FROM profiles profile
      JOIN users candidate on candidate.id = profile.user_id
      LEFT JOIN relationships r_critic ON r_critic.critic_user_id = ${req.user.id} AND r_critic.candidate_user_id = candidate.id
      LEFT JOIN relationships r_candidate ON r_candidate.critic_user_id = candidate.id AND r_candidate.candidate_user_id = ${req.user.id}
      ${isSmash ? `JOIN users critic on critic.id = ${req.user.id}` : ''}
      WHERE
        NOT profile.user_id = ANY($1) AND
        profile.user_id != ${req.user.id} AND
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
    `, [excludedUsers]);

    return res.status(200).json({
      status: codes.GET_SCENE_CANDIDATES__SUCCESS,
      candidates: result.rows,
    });
  } catch (error) {
    return apiUtils.error.server(res, 'Failed to search for candidates');
  }
};

module.exports = getSceneCandidates;
