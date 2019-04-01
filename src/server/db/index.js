// @flow
const pool = require('./pool');

module.exports = {
  query: pool.query,
  connect: pool.connect,
  pool,
  end: pool.end,
};
