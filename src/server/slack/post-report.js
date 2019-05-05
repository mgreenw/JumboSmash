// @flow

// NOTE: This file is horrendous and ugy. I'm sorry about that.

const { IncomingWebhook } = require('@slack/client');
const NODE_ENV = require('../utils').getNodeEnv();
const { colors, generateUserInfoSection } = require('./utils');

const reporting = new IncomingWebhook('https://hooks.slack.com/services/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');

async function postReport(
  reportingUserId: number,
  reportedUserId: number,
  message: string,
  reason: string,
  block: boolean,
): Promise<void> {
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'test') {
    const extraUserInfo = block ? [] : await generateUserInfoSection(`${block ? 'Blocked' : 'Reported'} User`, reportedUserId);

    const report = {
      text: block ? 'A user was blocked.' : 'A user report was filed.',
      attachments: [
        {
          color: block ? colors.WARNING : colors.DANGER,
          blocks: [
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Environment:*\n\`${NODE_ENV}\``,
                },
                {
                  type: 'mrkdwn',
                  text: `*Type:*\n${block ? 'Block' : 'Report'}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Reasons:*\n${reason}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*${block ? 'Blocking' : 'Reporting'} User:*\n${reportedUserId}`,
                },
              ],
            },
            ...extraUserInfo,
          ],
        },
      ],
    };

    // This pushes on extra context if it is a block vs report.
    if (!block) {
      report.attachments[0].blocks[0].fields.push({
        type: 'mrkdwn',
        text: `*Message:*\n${message}`,
      });
    } else {
      report.attachments[0].blocks[0].fields.push({
        type: 'mrkdwn',
        text: `*Blocked User Id:*\n${reportedUserId}`,
      });
    }

    await reporting.send(report);
  }
}

module.exports = postReport;
