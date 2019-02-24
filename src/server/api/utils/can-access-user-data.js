// @flow

const db = require('../../db');

async function canAccessUserData(
  requestedUserId: number,
  requestingUserId: ?number = null,
): Promise<boolean> {
  if (requestedUserId === requestingUserId) return true;
  const bannedResult = await db.query(`
    SELECT banned
    FROM classmates
    WHERE id = $1
  `, [requestedUserId]);

  if (bannedResult.rowCount === 0 || bannedResult.rows[0].banned === true) {
    return false;
  }

  if (!requestingUserId) return true;

  const blockedResult = await db.query(`
    SELECT COALESCE(r_critic.blocked OR r_candidate.blocked, false) AS blocked
    FROM relationships r_critic
    LEFT JOIN relationships r_candidate
      ON r_candidate.critic_user_id = r_critic.candidate_user_id
      AND r_candidate.candidate_user_id = r_critic.critic_user_id
    WHERE r_critic.critic_user_id = $1 AND r_critic.candidate_user_id = $2
  `, [requestingUserId, requestedUserId]);

  // If there is not a block in either direction, then the data can be accessed
  if (blockedResult.rowCount === 0) return true;
  return blockedResult.rows[0].blocked !== true;
}

module.exports = canAccessUserData;
