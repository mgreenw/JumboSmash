// @flow

const config = require('config');
const sgMail = require('@sendgrid/mail');

if (process.env.NODE_ENV === 'development') {
/* eslint-disable no-console */
  exports.send = console.log;
/* eslint-enable */
} else if (process.env.NODE_ENV === 'test') {
  exports.send = (message) => {};
} else {
  sgMail.setApiKey(config.get('sendgrid_api_key'));
  exports.send = sgMail.send;
}
