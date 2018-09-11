// @flow
import pool from './pool';
import live from './livequery';
live.init();

export default {
  query: pool.query,
  connect: pool.connect,
  pool,
  live
};
