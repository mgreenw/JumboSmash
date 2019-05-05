// @flow
const { IncomingWebhook } = require('@slack/client');

const NODE_ENV = require('../utils').getNodeEnv();
const { colors } = require('./utils');

exports.postReport = require('./post-report');

const verificationCodes = new IncomingWebhook('https://hooks.slack.com/services/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');
exports.postVerificationCode = (
  verificationCode: string,
  utln: string,
  email: string,
) => {
  // Only in staging and development
  if (NODE_ENV === 'staging' || NODE_ENV === 'development') {
    verificationCodes.send({
      text: `Code: ${verificationCode}`,
      attachments: [
        {
          color: colors.WAVE,
          blocks: [
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Environment:*\n${NODE_ENV}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*UTLN:*\n${utln}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Email:*\n${email}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Code:*\n${verificationCode}`,
                },
              ],
            },
          ],
        },
      ],
    });
  }
};


const feedback = new IncomingWebhook('https://hooks.slack.com/services/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');
exports.postFeedback = (
  userId: number,
  message: string,
  reasonCode: string,
) => {
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'test') {
    feedback.send(`
---------------------------
We've got some more feedback!

User ID: ${userId}
Environment:   *${NODE_ENV}*

Reason Code: ${reasonCode}
Message:
${'```'}${message}${'```'}`);
  }
};

const server = new IncomingWebhook('https://hooks.slack.com/services/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');
exports.postServerUpdate = (
  message: string,
) => {
  if (NODE_ENV === 'production') {
    server.send(message);
  }
};

const admin = new IncomingWebhook('https://hooks.slack.com/services/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');
exports.postAdminUpdate = (
  adminUserId: number,
  adminUtln: string,
  message: string,
) => {
  if (NODE_ENV === 'production' || NODE_ENV === 'development') {
    admin.send(`New admin action. NODE_ENV: ${NODE_ENV}
Admin: ${adminUtln} (${adminUserId})

${message}`);
  }
};
