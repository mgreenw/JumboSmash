// @flow

const { IncomingWebhook } = require('@slack/client');
const NODE_ENV = require('../utils').getNodeEnv();

const server = new IncomingWebhook('https://hooks.slack.com/services/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');
async function postServerUpdate(message: string) {
  if (NODE_ENV === 'production') {
    await server.send(message);
  }
}

module.exports = postServerUpdate;
