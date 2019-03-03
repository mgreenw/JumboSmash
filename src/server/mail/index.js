// @flow

const config = require('config');
const sgMail = require('@sendgrid/mail');
const logger = require('../logger');
const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

// Todo: Add logging for these endpoints
// If running on production, actually send emails. Otherwise, print to console.
if (NODE_ENV === 'production' || NODE_ENV === 'staging') {
  sgMail.setApiKey(config.get('sendgrid_api_key'));
  exports.send = (message: any) => {
    sgMail.send(message);
  };
} else if (NODE_ENV === 'development') {
  exports.send = (output: any) => {
    logger.debug(`Sending email:\nFrom: ${output.from}\nTo: ${output.to}\nSubject: ${output.subject}`);
  };
} else {
  exports.send = (output: any) => {
    return output;
  };
}
