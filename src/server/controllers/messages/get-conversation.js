// @flow

import type { $Request, $Response } from 'express';

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/messages/:userId
 *
 */
const getConversation = async (req: $Request, res: $Response) => {
  try {
    let query = `
      SELECT id, content, timestamp, sender_user_id AS "senderUserId", receiver_user_id AS "receiverUserId"
      FROM messages
      WHERE (
          (sender_user_id = $1 AND receiver_user_id = $2)
          OR
          (sender_user_id = $3 AND receiver_user_id = $4)
        )`;

    // No worries of SQL injection: we have run it through Number.parseInt()
    // If it is a number, use it in the query
    // Get the most recent message id. If it exists, parse the number
    let mostRecentMessageId = req.query['most-recent-message-id'];
    if (mostRecentMessageId !== undefined) {
      // Get the integer of the most recent message it
      mostRecentMessageId = Number.parseInt(mostRecentMessageId, 10);

      // If it is invalid (not an int), fail.
      if (Number.isNaN(mostRecentMessageId) || mostRecentMessageId <= 0) {
        return res.status(400).json({
          status: codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID,
        });
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
      [req.user.id, req.params.userId, req.params.userId, req.user.id],
    );

    return res.status(200).json({
      status: codes.GET_CONVERSATION__SUCCESS,
      messages: result.rows,
    });
  } catch (error) {
    return apiUtils.error.server(res, 'Not implemented');
  }
};

module.exports = getConversation;
