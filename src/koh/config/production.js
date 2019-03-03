// @flow

const secrets = require('../secrets');

module.exports = {
  db: {
    host: secrets.get("POSTGRES_HOST"),
    port: 5432,
    database: secrets.get("KOH_POSTGRES_DATABASE"),
    user: secrets.get("KOH_POSTGRES_USER"),
    password: secrets.get('KOH_POSTGRES_PASSWORD'),
  },
};
