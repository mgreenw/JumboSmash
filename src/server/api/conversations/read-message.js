// @flow

import type { $Request } from 'express';

const db = require('../../db');
const redis = require('../../redis');
const logger = require('../../logger');
const codes = require('../status-codes');
const Notifications = require('../../notifications');

const {
  status,
  asyncHandler,
  canAccessUserData,
} = require('../utils');

// These codes mean that nothing went wrong with reading the message from the match
// that came before the given system messageId. If there is a different code, we
// throw a server error
const acceptableReadPreviousMessageCodes = [
  'ALREADY_READ_MESSAGE',
  'GIVEN_MESSAGE_BEFORE_CURRENTLY_READ_MESSAGE',
];

/**
 * @api {patch} /api/conversations/:matchUserId/messages/:messageId
 *
 */
const readMessage = async (readerUserId: number, matchUserId: number, messageId: number) => {
  try {
    // Try inserting the read receipt. There is a database trigger that will catch
    // any bad case - this allows us to save a lot of queries/checks. For the most
    // part, we only care if it works or not.
    logger.debug(`reading message: ${readerUserId}, ${matchUserId}, ${messageId}`);
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

    // Update Redis with the new read message if necessary
    const conversationIsRead = await redis.shared.readMessage(
      redis.unreadConversationsKey(readerUserId),
      matchUserId.toString(),
      messageTimestamp.toISOString(),
    );

    // Send an update over socket
    Notifications.readReceiptUpdate(matchUserId, readerUserId, messageId, messageTimestamp);

    logger.debug(`Read message at timestamp ${messageTimestamp}. The conversation is ${conversationIsRead ? 'read' : 'still unread'}.`);
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
          SELECT
            system_message.timestamp as "messageTimestamp",
            (
              SELECT id
              FROM messages match_message
              WHERE
                from_system IS FALSE
                AND sender_user_id = $1
                AND receiver_user_id = $2
                AND match_message.timestamp < system_message.timestamp
              ORDER by match_message.timestamp desc
              LIMIT 1
            ) AS "previousMessageIdFromMatch"
          FROM messages system_message
          WHERE system_message.id = $3 AND system_message.from_system IS TRUE
        `, [matchUserId, readerUserId, messageId]);

        const [{
          messageTimestamp,
          previousMessageIdFromMatch,
        }] = systemMessageTimestampResult.rows;

        logger.debug(`System message read at ${messageTimestamp}.`);
        const conversationIsRead = await redis.shared.readMessage(
          redis.unreadConversationsKey(readerUserId),
          matchUserId.toString(),
          messageTimestamp.toISOString(),
        );

        // Weirdly, we need to read the previous match message id. This allows
        // mobile to only need to send one request per "read" event, but we can
        // update the read receipt if needed. This is fire and forget: we don't
        // care if this fails
        if (previousMessageIdFromMatch !== null) {
          // Call read message on the previous message id
          const readPreviousMessageResult = await readMessage(
            readerUserId,
            matchUserId,
            previousMessageIdFromMatch,
          );

          // Ensure the response is reasonable. If it is not one of the two expected responses
          // throw a SERVER_ERROR. This is a serious issue and we'll want to know. See the
          // comment on 'acceptableReadPreviousMessageCodes' above for more details
          // on the failure case.
          switch (readPreviousMessageResult.body.status) {
            case codes.READ_MESSAGE__SUCCESS.status:
              logger.debug('Successfully read message before system message');
              break;
            case codes.READ_MESSAGE__FAILURE.status: {
              const { code } = readPreviousMessageResult.body.data;
              if (!acceptableReadPreviousMessageCodes.includes(code)) {
                throw new Error(`Unexpected code received from failure case of reading a message before a system message: ${code}`);
              }
              logger.debug('Acceptable failure in reading message before a system message');
              break;
            }
            default:
              throw new Error(`Unexected response from reading a message before a system message: ${JSON.stringify(readPreviousMessageResult)}`);
          }
        }

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
    // Ensure the user's are matched. This is happening outside of the readMessage
    // endpoint to handle the weird system message needing to call the readMessage()
    // function directly. We don't want to double-check the match check, so we
    // handle it here.
    const canReadMessage = await canAccessUserData(req.params.matchUserId, req.user.id, {
      requireMatch: true,
    });
    if (!canReadMessage) {
      return status(codes.READ_MESSAGE__NOT_MATCHED).noData();
    }
    return readMessage(req.user.id, req.params.matchUserId, req.params.messageId);
  }),
];

module.exports = {
  handler,
  apply: readMessage,
};
