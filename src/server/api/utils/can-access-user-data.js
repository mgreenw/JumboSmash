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

  // Ensure the user exists
  const requestedUserExists = bannedResult.rowCount !== 0;
  if (!requestedUserExists) return false;

  // Ensure the user is not banned
  const requestedUserIsBanned = bannedResult.rows[0].banned === true;
  if (requestedUserIsBanned) return false;

  // If there is no requsting user id, we are done!
  if (!requestingUserId) return true;

  // Check if either user blocks the other
  const blockedResult = await db.query(`
    SELECT COALESCE(r_critic.blocked OR r_candidate.blocked, false) AS blocked
    FROM relationships r_critic
    LEFT JOIN relationships r_candidate
      ON r_candidate.critic_user_id = r_critic.candidate_user_id
      AND r_candidate.candidate_user_id = r_critic.critic_user_id
    WHERE r_critic.critic_user_id = $1 AND r_critic.candidate_user_id = $2
  `, [requestingUserId, requestedUserId]);

  // If there is not a block in either direction, then the data can be accessed
  if (blockedResult.rowCount === 0) return true; // If no relationship, no block exists
  return blockedResult.rows[0].blocked !== true; // No block --> User can access data
}

module.exports = canAccessUserData;
