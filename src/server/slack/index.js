// @flow
const { IncomingWebhook } = require('@slack/client');

const url = 'https://hooks.slack.com/services/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';
const webhook = new IncomingWebhook(url);
const utils = require('../utils');

// const NODE_ENV = utils.getNodeEnv();

function postVerificationCode(
  verificationCode: string,
  utln: string,
  email: string,
  inProduction: boolean,
) {
  // TODO: fix the NODE_ENV issue
  // if (!inProduction || NODE_ENV === 'production') {
  webhook.send(`code: *${verificationCode}* \n utln: *${utln}* \n email: *${email}*`);
  // }
}

exports.postVerificationCode = postVerificationCode;
