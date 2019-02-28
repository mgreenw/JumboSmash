// @flow

const secrets = require('../secrets');

module.exports = {
  db: {
    host: 'projectgem.ccpusbgks0bo.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'koh_staging',
    user: 'koh_staging_user',
    password: secrets.get('POSTGRES_KOH_STAGE_PASSWORD'),
  },
};
