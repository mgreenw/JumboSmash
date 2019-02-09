// @flow
const { IncomingWebhook } = require('@slack/client');

const url = 'https://hooks.slack.com/services/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';
const webhook = new IncomingWebhook(url);
const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

function postVerificationCode(
  verificationCode: string,
  utln: string,
  email: string,
) {
  // TODO: fix the NODE_ENV issue
  if (NODE_ENV !== 'travis' && NODE_ENV !== 'testing') {
    webhook.send(`
      code:  *${verificationCode}*
      utln:  *${utln}*
      email: *${email}*
      env:   *${NODE_ENV}*
    `);
  }
}

exports.postVerificationCode = postVerificationCode;
