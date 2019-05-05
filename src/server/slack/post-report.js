// @flow

// NOTE: This file is horrendous and ugy. I'm sorry about that.

const { IncomingWebhook } = require('@slack/client');
const NODE_ENV = require('../utils').getNodeEnv();
const { colors } = require('./utils');
const db = require('../db');

const reporting = new IncomingWebhook('https://hooks.slack.com/services/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');

async function postReport(
  reportingUserId: number,
  reportedUserId: number,
  message: string,
  reason: string,
  block: boolean,
): Promise<void> {
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'test') {
    let extraUserInfo = [];

    // Only add on extra info about the user if it is a report
    if (!block) {
      const [reportedUser] = (await db.query(`
        SELECT
          id,
          utln,
          email,
          display_name AS "displayName",
          birthday,
          bio,
          json_build_object(
            'smash', active_smash,
            'social', active_social,
            'stone', active_stone
          ) AS "activeScenes"
        FROM classmates
        JOIN profiles on profiles.user_id = classmates.id
        WHERE id = $1
      `, [reportedUserId])).rows;

      if (!reportedUser) {
        throw new Error(`Could not find profile for user ${reportedUserId}`);
      }

      const activeScenes = Object.entries(reportedUser.activeScenes)
        .filter(([, active]) => active)
        .map(([scene]) => scene);

      extraUserInfo = [
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${block ? 'Blocked' : 'Reported'} User*

    *id*: ${reportedUser.id}
    *UTLN*: ${reportedUser.utln}
    *Display Name*: ${reportedUser.displayName}
    *Email*: ${reportedUser.email}
    `.trim(),
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              emoji: true,
              text: `Active Scenes: ${activeScenes.length === 0 ? 'None' : activeScenes.join(', ')}`,
            },
          ],
        },
      ];
    }

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
