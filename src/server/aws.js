// @flow

const aws = require('aws-sdk');
const config = require('config');

// If the aws credentials are already set, don't do anything!
// If they are not, try to read them from the config file
// If the config file does not have them, exit.
if (!aws.config.credentials) {
  if (!config.has('aws_credentials')) {
    throw new Error('Could not find AWS credentials. Exiting.');
  }
  aws.config.update(config.get('aws_credentials'));
}

aws.config.region = 'us-east-1';

module.exports = aws;
