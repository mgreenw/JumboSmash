// @flow

// const config = require("config");
// const sgMail = require("@sendgrid/mail");
const logger = require('../logger');
const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

// Todo: Add logging for these endpoints
// If running on production, actually send emails. Otherwise, print to console.
if (NODE_ENV === 'production') {
  // We shouldn't be sending arbitrary emails without a whitelist untill we're
  // out of beta. Untill we have a better system, let's disable it for now, and
  // in the meantime, verification codes can be posted to Slack.
  // sgMail.setApiKey(config.get("sendgrid_api_key"));
  // exports.send = sgMail.send;
  exports.send = (output: any) => {
    return output;
  };
} else if (NODE_ENV === 'development') {
  exports.send = (output: any) => {
    logger.info(JSON.stringify(output, null, 2));
  };
} else {
  exports.send = (output: any) => {
    return output;
  };
}
