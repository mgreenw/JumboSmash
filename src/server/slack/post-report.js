// @flow

// NOTE: This file is horrendous and ugy. I'm sorry about that.

const { IncomingWebhook } = require('@slack/client');
const db = require('../db');
const NODE_ENV = require('../utils').getNodeEnv();
const { colors, generateUserInfoSection } = require('./utils');
const route = NODE_ENV === 'develpoment'
  ? 'https://hooks.slack.com/services/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'
  : 'https://hooks.slack.com/services/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';

const reporting = new IncomingWebhook(route);

async function postReport(
  reportingUserId: number,
  reportedUserId: number,
  message: string,
  reason: string,
  block: boolean,
): Promise<void> {
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'test') {
    const [{ utln }] = (await db.query('SELECT utln FROM classmates WHERE id = $1', [reportedUserId])).rows;
    const extraUserInfo = block ? [{
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Id*: ${reportedUserId}`,
        },
        {
          type: 'mrkdwn',
          text: `*Utln:* ${utln}`,
        },
      ],
    }] : await generateUserInfoSection(`${block ? 'Blocked' : 'Reported'} User`, reportedUserId);

    const report = {
      text: block ? 'A user was blocked.' : 'A user report was filed.',
      attachments: [
        {
          color: block ? colors.WARNING : colors.DANGER,
          blocks: [
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `${block ? 'Blocked' : 'Reported'} by *User Id ${reportingUserId}* in \`${NODE_ENV}\``,
                },
              ],
            },
            {
              type: 'section',
              fields: [
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

    await reporting.send(report);
  }
}

module.exports = postReport;
