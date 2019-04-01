// @flow

import type { $Request } from 'express';

const db = require('../../db');
const redis = require('../../redis');
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
        (SELECT timestamp FROM messages WHERE id = $1) AS "messageTimestamp"
    `, [messageId, readerUserId, matchUserId]);

    // We should never hit this case because we check the user's are matched in the handler
    // but it is still a good sanity check.
    if (result.rows.length === 0) {
      return status(codes.READ_MESSAGE__NOT_MATCHED).noData();
    }

    const [{ messageTimestamp }] = result.rows;

    const conversationIsRead = await redis.shared.readMessage(
      redis.unreadConversationsKey(readerUserId),
      matchUserId.toString(),
      messageTimestamp.toISOString(),
    );

    logger.debug(`Read message at timestamp ${messageTimestamp}. The conversation is ${conversationIsRead ? 'read' : 'still unread'}.`);

    // TODO: Send a socket notification to the match to update the read receipt.

    return status(codes.READ_MESSAGE__SUCCESS).noData();
  } catch (error) {
    // This specific error means the message id is not valid.
    if (error.constraint && error.constraint === 'relationships_critic_read_message_id_fkey') {
      return status(codes.READ_MESSAGE__MESSAGE_NOT_FOUND).noData();
    }

    // If the error is from a user-raised exception, this is not a server error.
    // Return that there was a failure and sent the error message and hint
    if (error.code === 'P0001') {
      // If the message that is being read is a system message, we return success.
      // This is because we do not store it as a read receipt but we will still
      // update Redis if necessary.
      if (error.hint === 'CANNOT_READ_SYSTEM_MESSAGE') {
        const systemMessageTimestampResult = await db.query(`
          SELECT timestamp as "messageTimestamp"
          FROM messages
          WHERE id = $1 AND from_system IS TRUE
        `, [messageId]);

        const [{ messageTimestamp }] = systemMessageTimestampResult.rows;
        logger.debug(`System message read at ${messageTimestamp}`);

        const conversationIsRead = await redis.shared.readMessage(
          redis.unreadConversationsKey(readerUserId),
          matchUserId.toString(),
          messageTimestamp.toISOString(),
        );

        logger.debug(`Read system message at timestamp ${messageTimestamp}. The conversation is ${conversationIsRead ? 'read' : 'still unread'}.`);

        return status(codes.READ_MESSAGE__SUCCESS).noData();
      }

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