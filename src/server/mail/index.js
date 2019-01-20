// @flow

// const config = require("config");
// const sgMail = require("@sendgrid/mail");
const { IncomingWebhook } = require('@slack/client');
const logger = require('../logger');
const utils = require('../utils');

const url = 'https://hooks.slack.com/services/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';
const webhook = new IncomingWebhook(url);
const NODE_ENV = utils.getNodeEnv();

// Non-critical code for the purposes of beta-testing only,
// so let's throw away errors if we get any.
function postVerificationCodeToSlack(content: any) {
  webhook.send(JSON.stringify(content, null, 2));
}

// Todo: Add logging for these endpoints
// If running on production, actually send emails. Otherwise, print to console.
if (NODE_ENV === 'production') {
  // We shouldn't be sending arbitrary emails without a whitelist untill we're
  // out of beta. Untill we have a better system, let's disable it for now, and
  // in the meantime, verification codes can be posted to Slack.

  // sgMail.setApiKey(config.get("sendgrid_api_key"));
  // exports.send = sgMail.send;
  exports.send = postVerificationCodeToSlack;
} else if (NODE_ENV === 'development') {
  exports.send = (output: any) => {
    postVerificationCodeToSlack(output);
    logger.info(JSON.stringify(output, null, 2));
  };
} else {
  exports.send = (output: any) => {
    return output;
  };
}
