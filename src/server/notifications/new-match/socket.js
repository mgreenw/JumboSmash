// @flow

const logger = require('../../logger');
const Socket = require('../../socket');
const db = require('../../db');
const relationshipUtils = require('../../api/relationships/utils');

const NEW_MATCH = 'NEW_MATCH';
module.exports = async (matchingUserId: number, matchedUserId: number, scene: string) => {
  const matchResult = await db.query(`
    ${relationshipUtils.matchQuery}
    AND me_critic.candidate_user_id = $2
    LIMIT 1
  `, [matchingUserId, matchedUserId]);

  if (matchResult.rowCount === 0) {
    logger.error('No match found in attempt to send notification.');
    return [];
  }

  const [match] = matchResult.rows;

  // Send the notification over socket to the matched user
  return Socket.notify(matchingUserId, NEW_MATCH, { match, scene });
};
