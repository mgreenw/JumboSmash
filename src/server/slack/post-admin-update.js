// @flow

const { IncomingWebhook } = require('@slack/client');
const NODE_ENV = require('../utils').getNodeEnv();

const admin = new IncomingWebhook('https://hooks.slack.com/services/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');

async function postAdminUpdate(adminUserId: number, adminUtln: string, message: string) {
  if (NODE_ENV === 'production' || NODE_ENV === 'development') {
    await admin.send(`New admin action. NODE_ENV: ${NODE_ENV}
Admin: ${adminUtln} (${adminUserId})

${message}`);
  }
}

module.exports = postAdminUpdate;
