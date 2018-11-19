// @flow

import type { $Request, $Response } from 'express';

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/relationships/matches
 *
 */
const getMatches = async (req: $Request, res: $Response) => {
  try {
    const result = await db.query(`
      SELECT
        they_profile.user_id as "userId",
        they_profile.display_name AS "displayName",
        to_char(they_profile.birthday, 'YYYY-MM-DD') AS birthday,
        they_profile.bio,
        array_remove(ARRAY[
          CASE (me_critic.liked_smash AND they_critic.liked_smash) WHEN true THEN 'smash' ELSE NULL END,
          CASE (me_critic.liked_social AND they_critic.liked_social) WHEN true THEN 'social' ELSE NULL END,
          CASE (me_critic.liked_stone AND they_critic.liked_stone) WHEN true THEN 'stone' ELSE NULL END
        ], NULL) AS scenes
      FROM relationships me_critic
      JOIN relationships they_critic
        ON they_critic.candidate_user_id = ${req.user.id}
        AND they_critic.critic_user_id = me_critic.candidate_user_id
      JOIN profiles they_profile
        ON they_profile.user_id = me_critic.candidate_user_id
      WHERE
        me_critic.critic_user_id = ${req.user.id}
        AND me_critic.candidate_user_id = they_critic.critic_user_id
        AND NOT (me_critic.blocked OR they_critic.blocked)
        AND
          (me_critic.liked_smash AND they_critic.liked_smash)
          OR (me_critic.liked_social AND they_critic.liked_social)
          OR (me_critic.liked_smash AND they_critic.liked_social)
    `);
    return res.send(200).json({
      status: codes.GET_MATCHES__SUCCESS,
      matches: result.rows,
    });
  } catch (error) {
    return apiUtils.error.server(res, 'Failed to get user matches');
  }
};

module.exports = getMatches;
