// @flow
/* eslint-disable no-restricted-syntax */

const _ = require('lodash');
const { Expo } = require('expo-server-sdk');
const Sentry = require('@sentry/node');

const db = require('../db');
const logger = require('../logger');

const expo = new Expo();

type Receipt = {
  status: string,
  message?: string,
  details?: {
    error?: string,
  },
};

type Notification = {
  id: number,
  ticketId: string,
  userId: number,
  status: string,
  message?: string,
  errorDetails: string,
};

const oneMinute = 60000;
const receiptCheckPeriod = oneMinute * 15; // 15 Minutes

async function checkReceipts() {
  // Get the all notifications sent more than 15 minutes ago
  logger.debug(`Beginning receipt check for notifications that were sent ${receiptCheckPeriod / oneMinute} ago`);
  const results = (await db.query(`
    SELECT id, ticket_id AS "ticketId", user_id AS "userId", status
    FROM notifications
    WHERE
      status = 'pending'
      AND sent_timestamp < (NOW() - INTERVAL '${receiptCheckPeriod} milliseconds')
    LIMIT 1000
  `)).rows;

  // Generate an object mapping from ticketId to notification
  const notifications: {[ticketId: string]: Notification } = {};
  results.forEach((notification) => {
    notifications[notification.ticketId] = notification;
  });

  // Retrieve the receipts from expo
  logger.debug('Querying expo for receipts.');
  const receipts: {[ticketId: string]: Receipt } = await expo.getPushNotificationReceiptsAsync(
    Object.keys(notifications),
  );

  // Add the important properties from each receipt to the appropriate notification
  Object.keys(receipts).forEach((ticketId) => {
    const receipt = receipts[ticketId];
    notifications[ticketId].status = receipt.status;
    if (receipt.status !== 'ok') {
      notifications[ticketId].message = receipt.message;
      if (receipt.details && receipt.details.error) {
        notifications[ticketId].errorDetails = receipt.details.error;
        logger.debug(`Failed to send push notification ${JSON.stringify(notifications[ticketId], null, 2)}`);
        Sentry.withScope((scope) => {
          scope.setExtra('notification', notifications[ticketId]);
          Sentry.captureMessage('Failed to send push notification');
        });
      }
    }
  });

  if (Object.keys(notifications).length === 0) {
    logger.debug('No notification receipts to check.');
    return;
  }

  // Create the paramaeter strings for the update query
  logger.debug('Updating notification receipts.');
  const generateValueTemplate = (startIndex: number): string => {
    return `($${startIndex + 1}::integer, $${startIndex + 2}::notification_status, $${startIndex + 3}, $${startIndex + 4})`;
  };
  const template = Object.keys(notifications).map(
    (ticketId, index) => generateValueTemplate(index * 4),
  ).join(',');
  const params = Object.keys(notifications).map((ticketId) => {
    const notification = notifications[ticketId];
    return [notification.id, notification.status, notification.message, notification.errorDetails];
  });

  // Update the notifications and finish!
  await db.query(`
    UPDATE notifications
    SET
      status = updated.status,
      message = updated.message,
      error_details = updated.error_details
    FROM (VALUES
      ${template}
    ) AS updated(id, status, message, error_details)
    WHERE notifications.id = updated.id
  `, _.flatten(params));

  logger.debug('Done checking notification receipts.');
}

module.exports = checkReceipts;
