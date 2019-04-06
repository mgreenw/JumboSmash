// @flow

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
  koh_host: 'https://stagingkoh.jumbosmash.com',
  aws_credentials: {
    accessKeyId: secrets.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: secrets.get('AWS_SECRET_ACCESS_KEY'),
  },
  s3_bucket: 'projectgem-prod',
  redis: {
    host: 'gem_staging_redis',
    port: 6379,
  },
  launch_date: secrets.get('LAUNCH_DATE'),
};
