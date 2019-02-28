// @flow

const secrets = require('../secrets');

module.exports = {
  db: {
    host: 'projectgem.ccpusbgks0bo.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'server_staging',
    user: 'server_staging_user',
    password: secrets.get('POSTGRES_SERVER_STAGE_PASSWORD'),
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
    host: 'gem_staging_redis',
    port: 6379,
  },
};
