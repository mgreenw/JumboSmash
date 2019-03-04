// @flow

const config = require('config');
const Queue = require('bull');

const checkReceipts = require('./check-receipts');
const logger = require('../logger');

const notificationReceiptQueue = new Queue('notification receipts', {
  redis: config.get('redis'),
});

notificationReceiptQueue.on('error', (error) => {
  logger.error('Error in receipt notification processing', error);
});

notificationReceiptQueue.on('failed', (job, error) => {
  logger.error('Receipt notification job failed', error);
});

notificationReceiptQueue.process(checkReceipts);

module.exports = notificationReceiptQueue;