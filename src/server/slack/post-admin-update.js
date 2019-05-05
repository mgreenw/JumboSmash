// @flow

const { IncomingWebhook } = require('@slack/client');
const NODE_ENV = require('../utils').getNodeEnv();
const { colors, generateUserInfoSection } = require('./utils');

const admin = new IncomingWebhook('https://hooks.slack.com/services/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');

type AdminUpdate = 'Terminate User' | 'Review Profile';
async function postAdminUpdate(
  adminUserId: number,
  adminUtln: string,
  type: AdminUpdate,
  action: Object[],
  userId?: number,
) {
  if (NODE_ENV === 'production' || NODE_ENV === 'development') {
    const [text, color] = (() => {
      switch (type) {
        case 'Terminate User':
          return ['terminated a user.', colors.DANGER];
        case 'Review Profile':
          return ['reviewed a profile.', colors.WARNING];
        default:
          return colors.GEM;
      }
    })();

    let userInfo = [];
    if (userId) {
      userInfo = await generateUserInfoSection('User Info', userId);
    }

    const update = {
      text: `An admin ${text}`,
      attachments: [
        {
          color,
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
                  text: `*Type:*\n${type}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Admin User Id:*\n${adminUserId}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Admin UTLN:*\n${adminUtln}`,
                },
              ],
            },
            {
              type: 'divider',
            },
            ...action,
            ...userInfo,
          ],
        },
      ],
    };

    await admin.send(update);
  }
}

module.exports = postAdminUpdate;
