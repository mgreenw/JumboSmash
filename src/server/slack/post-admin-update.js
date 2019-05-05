// @flow

const { IncomingWebhook } = require('@slack/client');
const NODE_ENV = require('../utils').getNodeEnv();
const { colors, generateUserInfoSection } = require('./utils');

const route = NODE_ENV === 'development'
  ? 'https://hooks.slack.com/services/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'
  : 'https://hooks.slack.com/services/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';

const admin = new IncomingWebhook(route);

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
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `Admin: ${adminUtln} in \`${NODE_ENV}\``,
                },
              ],
            },
            ...action,
            {
              type: 'divider',
            },
            ...userInfo,
          ],
        },
      ],
    };

    await admin.send(update);
  }
}

module.exports = postAdminUpdate;
