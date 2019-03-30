// @flow

import type { $Request } from 'express';

const db = require('../../db');
const { asyncHandler, status, canAccessUserData } = require('../utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/conversations/:userId
 *
 */
const getConversation = async (
  userId: number,
  matchUserId: number,
  mostRecentMessageIdStr: ?string = undefined,
) => {
  let query = `
    SELECT
      id AS "messageId",
      content,
      timestamp,
      unconfirmed_message_uuid AS "unconfirmedMessageUuid",
      CASE
        WHEN from_system IS true THEN 'system'
        WHEN sender_user_id = $1 THEN 'client'
        ELSE 'match'
      END AS sender
    FROM messages
    WHERE (
        (sender_user_id = $1 AND receiver_user_id = $2)
        OR
        (sender_user_id = $2 AND receiver_user_id = $1)
      )`;

  // No worries of SQL injection: we have run it through Number.parseInt()
  // If it is a number, use it in the query
  // Get the most recent message id. If it exists, parse the number
  let mostRecentMessageId;
  if (mostRecentMessageIdStr) {
    // Get the integer of the most recent message id
    mostRecentMessageId = Number.parseInt(mostRecentMessageIdStr, 10);

    // If it is invalid (not an int), fail.
    if (Number.isNaN(mostRecentMessageId) || mostRecentMessageId <= 0) {
      return status(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID).noData();
    }

    // Add the "most recent" part of the query
    query += `AND timestamp >= (
        SELECT timestamp
        FROM messages
        WHERE id = ${mostRecentMessageId}
      )
      AND id != ${mostRecentMessageId}`;
  }

  // Always order by timestamp
  query += `
    ORDER BY timestamp
  `;

  const result = await db.query(
    query,
    [userId, matchUserId],
  );

  return status(codes.GET_CONVERSATION__SUCCESS).data(result.rows);
};

const handler = [
  asyncHandler(async (req: $Request) => {
    // If the user is banned, return an emtpy array (which is the default
    // if the user couldn't be found otherwise)
    const allowedAccess = await canAccessUserData(req.params.userId, req.user.id, {
      requireMatch: true,
    });

    if (!allowedAccess) {
      return status(codes.GET_CONVERSATION__SUCCESS).data([]);
    }

    return getConversation(req.user.id, req.params.userId, req.query['most-recent-message-id']);
  }),
];

module.exports = {
  handler,
  apply: getConversation,
};
