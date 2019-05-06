// @flow

const { IncomingWebhook } = require('@slack/client');
const NODE_ENV = require('../utils').getNodeEnv();

const feedback = new IncomingWebhook('https://hooks.slack.com/services/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');

async function postFeedback(userId: number, message: string, reasonCode: string) {
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'test') {
    await feedback.send(`
---------------------------
We've got some more feedback!

User ID: ${userId}
Environment:   *${NODE_ENV}*

Reason Code: ${reasonCode}
Message:
${'```'}${message}${'```'}`);
  }
}

module.exports = postFeedback;
