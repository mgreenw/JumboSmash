// @flow
let config = require('config');
const { Pool } = require('pg');

const pool = new Pool(config.get('db'));

export default {
  query: (text: string, params: ?(any[])) => pool.query(text, params),
  connect: async () => pool.connect()
};
