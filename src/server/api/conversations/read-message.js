// @flow

import type { $Request } from 'express';

const db = require('../../db');
const logger = require('../../logger');
const codes = require('../status-codes');
const {
  status,
  asyncHandler,
  canAccessUserData,
} = require('../utils');

/**
 * @api {patch} /api/conversations/:matchUserId/messages/:messageId
 *
 */
const readMessage = async (readerUserId: number, matchUserId: number, messageId: number) => {
  try {
    // Ensure the user's are matched
    const canReadMessage = await canAccessUserData(matchUserId, readerUserId, {
      requireMatch: true,
    });
    if (!canReadMessage) {
      return status(codes.READ_MESSAGE__NOT_MATCHED).noData();
    }

    // Try inserting the read receipt. There is a database trigger that will catch
    // any bad case - this allows us to save a lot of queries/checks. For the most
    // part, we only care if it works or not.
    const result = await db.query(`
      UPDATE relationships
      SET critic_read_message_id = $1, critic_read_message_timestamp = NOW()
      WHERE critic_user_id = $2 AND candidate_user_id = $3
      RETURNING
        critic_read_message_timestamp AS "readTimestamp",
        (SELECT timestamp FROM messages where id = $1) AS "messageTimestamp"
    `, [messageId, readerUserId, matchUserId]);

    // We should never hit this case because we check the user's are matched in the handler
    // but it is still a good sanity check.
    if (result.rows.length === 0) {
      return status(codes.READ_MESSAGE__NOT_MATCHED).noData();
    }

    const [{ readTimestamp, messageTimestamp }] = result.rows;
    logger.silly(`Read message at timestamp ${messageTimestamp}`);

    return status(codes.READ_MESSAGE__SUCCESS).data({
      readTimestamp,
    });
  } catch (error) {
    // This specific error means the message id is not valid.
    if (error.constraint && error.constraint === 'relationships_critic_read_message_id_fkey') {
      return status(codes.READ_MESSAGE__MESSAGE_NOT_FOUND).noData();
    }

    // If the error is from a user-raised exception, this is not a server error.
    // Return that there was a failure and sent the error message and hint
    if (error.code === 'P0001') {
      return status(codes.READ_MESSAGE__FAILURE).data({
        message: error.message,
        code: error.hint,
      });
    }

    // If the error is not a 'P0001' error, it is a server error.
    throw error;
  }
};

const handler = [
  asyncHandler(async (req: $Request) => {
    return readMessage(req.user.id, req.params.matchUserId, req.params.messageId);
  }),
];

module.exports = {
  handler,
  apply: readMessage,
};
