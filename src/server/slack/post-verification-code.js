// @flow

const { IncomingWebhook } = require('@slack/client');
const NODE_ENV = require('../utils').getNodeEnv();
const { colors } = require('./utils');

const verificationCodes = new IncomingWebhook('https://hooks.slack.com/services/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');

async function postVerificationCode(verificationCode: string, utln: string, email: string) {
  // Only in staging and development
  if (NODE_ENV === 'staging' || NODE_ENV === 'development') {
    await verificationCodes.send({
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
}

module.exports = postVerificationCode;
