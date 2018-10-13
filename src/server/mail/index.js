// @flow

const config = require('config');
const sgMail = require('@sendgrid/mail');

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
/* eslint-disable no-console */
  module.exports = {
    send: console.log,
  };
/* eslint-enable */
} else {
  sgMail.setApiKey(config.get('sendgrid_api_key'));
  module.exports = {
    send: sgMail.send,
  };
}
