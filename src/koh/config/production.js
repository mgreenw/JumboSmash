// @flow

const secrets = require('../secrets');

module.exports = {
  db: {
    host: 'projectgem.ccpusbgks0bo.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: 'koh_production',
    user: 'koh_production_user',
    password: secrets.get('POSTGRES_KOH_PROD_PASSWORD'),
  },
};
