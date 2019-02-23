// @flow

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
  s3_bucket: 'projectgem-prod',
  redis: {
    host: 'gem_redis',
    port: 6379,
  },
};
