// @flow

const { status, asyncHandler } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');


/**
 * @api {get} /admin/classmates
 *
 */
const getClassmates = async () => {
  const classmatesResult = await db.query(`
    SELECT
      id,
      utln,
      email,
      banned AS "isBanned",
      json_build_object(
        'smash', active_smash,
        'social', active_social,
        'stone', active_stone
      ) AS "activeScenes",
      admin_password IS NOT NULL AS "isAdmin"
    FROM classmates
  `);
  return status(codes.GET_SETTINGS__SUCCESS).data({
    classmates: classmatesResult.rows,
  });
};

const handler = [
  asyncHandler(async () => {
    return getClassmates();
  }),
];

module.exports = {
  handler,
  apply: getClassmates,
};
