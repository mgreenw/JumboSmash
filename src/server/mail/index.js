// @flow

const config = require('config');
const sgMail = require('@sendgrid/mail');

const logger = require('../logger');
const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

// Todo: Add logging for these endpoints
// If running on production, actually send emails. Otherwise, print to console.
if (NODE_ENV === 'production') {
  sgMail.setApiKey(config.get('sendgrid_api_key'));
  exports.send = sgMail.send;
} else if (NODE_ENV === 'development') {
  exports.send = (output) => {
    logger.info(output);
  };
} else {
  exports.send = (output) => {
    return output;
  };
}
