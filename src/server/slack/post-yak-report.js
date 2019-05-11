// @flow

// NOTE: This file is horrendous and ugy. I'm sorry about that.

const { IncomingWebhook } = require('@slack/client');
const db = require('../db');
const NODE_ENV = require('../utils').getNodeEnv();
const { colors, generateUserInfoSection } = require('./utils');

const route = NODE_ENV === 'development'
  ? 'https://hooks.slack.com/services/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'
  : 'https://hooks.slack.com/services/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';

const yakReport = new IncomingWebhook(route);

async function postYakReport(
  reportingUserId: number,
  yakId: number,
  message: string,
  reason: string,
): Promise<void> {
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'test') {
    const [{ yakSenderUserId, content }] = (await db.query('SELECT user_id, content AS "yakSenderUserId" FROM yaks WHERE id = $1', [yakId])).rows;
    const extraUserInfo = await generateUserInfoSection('Yak Poster', yakSenderUserId);

    const report = {
      text: 'A yak was reported.',
      attachments: [
        {
          color: colors.WARNING,
          blocks: [
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `Reported by *User Id ${reportingUserId}* in \`${NODE_ENV}\``,
                },
              ],
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Yak Text*: ${content}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Reasons*: ${reason}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Message:* ${message}`,
                },
              ],
            },
            {
              type: 'divider',
            },
            ...extraUserInfo,
          ],
        },
      ],
    };

    await yakReport.send(report);
  }
}

module.exports = postYakReport;
