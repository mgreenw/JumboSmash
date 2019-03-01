// @flow

const _ = require('lodash');
const secrets = require('../secrets');

module.exports = {
  db: {
    host: secrets.get('POSTGRES_HOST'),
    port: 5432,
    database: secrets.get('POSTGRES_DATABASE'),
    user: secrets.get('POSTGRES_USER'),
    password: secrets.get('POSTGRES_PASSWORD'),
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
    host: 'gem_redis',
    port: 6379,
  },
  google: {
    /* eslint-disable no-useless-escape */
    private_key: _.replace(secrets.get('GOOGLE_PRIVATE_KEY'), new RegExp('\\\\n', '\g'), '\n'),
    client_email: 'projectgem-server@projectgem.iam.gserviceaccount.com',
    project_id: 'projectgem',
  },
};
