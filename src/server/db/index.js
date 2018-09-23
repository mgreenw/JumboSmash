// @flow
import pool from './pool';

export default {
  query: pool.query,
  connect: pool.connect,
  pool,
};
