// @flow
const { IncomingWebhook } = require('@slack/client');

const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

const verificationCodes = new IncomingWebhook('https://hooks.slack.com/services/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');
exports.postVerificationCode = (
  verificationCode: string,
  utln: string,
  email: string,
) => {
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'testing') {
    verificationCodes.send(`
      code:  *${verificationCode}*
      utln:  *${utln}*
      email: *${email}*
      env:   *${NODE_ENV}*
    `);
  }
};

const reporting = new IncomingWebhook('https://hooks.slack.com/services/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');
exports.postReport = (
  reportingUserId: number,
  reportedUserId: number,
  message: string,
) => {
  // TODO: Send an email as a backup in case slack fails to send the report.
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'testing') {
    reporting.send(`
A new report was filed.

Reporting User: *${reportingUserId}*
Reported User: *${reportedUserId}*
Environment:   *${NODE_ENV}*

${'```'}${message}${'```'}`);
  }
};

const feedback = new IncomingWebhook('https://hooks.slack.com/services/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');
exports.postFeedback = (
  userId: number,
  message: string,
) => {
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'testing') {
    feedback.send(`
---------------------------
We've got some more feedback!

User ID: ${userId}
Environment:   *${NODE_ENV}*

Message:
${'```'}${message}${'```'}`);
  }
};

const server = new IncomingWebhook('https://hooks.slack.com/services/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');
exports.postServerUpdate = (
  message: string,
) => {
  if (NODE_ENV === 'staging' || NODE_ENV === 'production') {
    server.send(message);
  }
};
