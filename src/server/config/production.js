// @flow

const _ = require('lodash');
const secrets = require('../secrets');

module.exports = {
  db: {
    host: secrets.get('POSTGRES_HOST'),
    port: 5432,
    database: secrets.get('SERVER_POSTGRES_DATABASE'),
    user: secrets.get('SERVER_POSTGRES_USER'),
    password: secrets.get('SERVER_POSTGRES_PASSWORD'),
  },
  secret: secrets.get('SECRET'),
  sendgrid_api_key: secrets.get('SENDGRID_API_KEY'),
  koh_host: 'https://koh.jumbosmash.com',
  aws_credentials: {
    accessKeyId: secrets.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: secrets.get('AWS_SECRET_ACCESS_KEY'),
  },
  s3_bucket: 'projectgem-prod',
  redis: {
    host: secrets.get('REDIS_HOST'),
    port: 6379,
  },
  // These keys are used for Google Stackdriver, which we use for their logging service
  // The weird replace below removes all newlines from the private key which were
  // causing it to fail.
  google: {
    /* eslint-disable no-useless-escape */
    private_key: _.replace(secrets.get('GOOGLE_PRIVATE_KEY'), new RegExp('\\\\n', '\g'), '\n'),
    client_email: 'projectgem-server@projectgem.iam.gserviceaccount.com',
    project_id: 'projectgem',
  },
  launch_date: secrets.get('LAUNCH_DATE'),
  spotify_client_id: 'd300522fd10f4f02b164d97bcfd9390b',
  spotify_client_secret: secrets.get('SPOTIFY_CLIENT_SECRET'),
};
