// @flow

const db = require('../../db');
const scenes = require('../relationships/utils/scenes');

const matchedQuery = scenes.map((scene) => {
  return `(COALESCE(r_critic.liked_${scene}, false) AND COALESCE(r_candidate.liked_${scene}, false))`;
}).join(' OR ');

type Options = {
  requireMatch: boolean,
};

async function canAccessUserData(
  requestedUserId: number,
  requestingUserId: ?number = null,
  options: Options = { requireMatch: false },
  requestingUserIsAdmin: boolean = false, // This falsy default is very important
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

  // If the requesting user is an admin, they can always have access.
  if (requestingUserIsAdmin) return true;

  // Ensure the user is not banned
  const requestedUserIsBanned = bannedResult.rows[0].banned === true;
  if (requestedUserIsBanned) return false;

  // If there is no requsting user id, we are done!
  if (!requestingUserId) return true;

  // Check if either user blocks the other
  const relationshipResult = await db.query(`
    SELECT
      COALESCE(r_critic.blocked OR r_candidate.blocked, false) AS blocked,
      ${matchedQuery} AS matched
    FROM relationships r_critic
    LEFT JOIN relationships r_candidate
      ON r_candidate.critic_user_id = r_critic.candidate_user_id
      AND r_candidate.candidate_user_id = r_critic.critic_user_id
    WHERE r_critic.critic_user_id = $1 AND r_critic.candidate_user_id = $2
  `, [requestingUserId, requestedUserId]);

  // If there is not a block in either direction, then all we care about is the match
  // If there is no relationship, then there is no match.
  const relationshipEmpty = relationshipResult.rowCount === 0;
  if (relationshipEmpty) {
    // Only return true if no match is required
    // If no relationship, no block exists
    return options.requireMatch === false;
  }

  const relationship = relationshipResult.rows[0];

  // If a match is required, then ensure the two users are matched.
  if (options.requireMatch) {
    return (relationship.matched === true) && (relationship.blocked !== true);
  }

  // Can access user data if there is no block in the relationship
  return relationship.blocked !== true;
}

module.exports = canAccessUserData;
