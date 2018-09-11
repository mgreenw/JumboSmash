// @flow
import config from 'config';
const { Pool } = require('pg');

const dbConfig = config.get('db');
const pool = new Pool(dbConfig);

export default {
  query: (text: string, params: ?(any[])) => pool.query(text, params),
  connect: async () => pool.connect()
};
