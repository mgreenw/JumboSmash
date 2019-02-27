// @flow
/* eslint-disable no-restricted-syntax */

const _ = require('lodash');
const { Expo } = require('expo-server-sdk');

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

async function checkReceipts(job: { data: string[] }) {
  logger.info(`Beginning receipt check for ${job.data.length} notifications`);

  const results = (await db.query(`
    SELECT id, ticket_id AS "ticketId", user_id AS "userId", status
    FROM notifications
    WHERE
      ticket_id = ANY ($1)
      AND status = 'pending'
  `, [job.data])).rows;

  const notifications: {[ticketId: string]: Notification } = {};
  results.forEach((notification) => {
    notifications[notification.ticketId] = notification;
  });

  logger.info('Querying expo for receipts.');

  const receipts: {[ticketId: string]: Receipt } = await expo.getPushNotificationReceiptsAsync(
    Object.keys(notifications),
  );
  Object.keys(receipts).forEach((ticketId) => {
    const receipt = receipts[ticketId];
    notifications[ticketId].status = receipt.status;
    if (receipt.status !== 'ok') {
      notifications[ticketId].message = receipt.message;
      if (receipt.details && receipt.details.error) {
        notifications[ticketId].errorDetails = receipt.details.error;
      }
    }
  });

  const generateValueTemplate = (startIndex: number): string => {
    return `($${startIndex + 1}::notification_status, $${startIndex + 2}, $${startIndex + 3})`;
  };

  const template = Object.keys(notifications).map(
    (ticketId, index) => generateValueTemplate(index * 3),
  ).join(',');

  const params = Object.keys(notifications).map((ticketId) => {
    const notification = notifications[ticketId];
    return [notification.status, notification.message, notification.errorDetails];
  });

  logger.info('Updating notification receipts.');

  await db.query(`
    UPDATE notifications
    SET
      status = updated.status,
      message = updated.message,
      error_details = updated.error_details
    FROM (VALUES
      ${template}
    ) AS updated(status, message, error_details)
  `, _.flatten(params));

  logger.info('Done checking notification receipts.');
}

module.exports = checkReceipts;
