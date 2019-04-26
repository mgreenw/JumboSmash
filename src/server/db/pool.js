// @flow
const config = require('config');
const { Pool } = require('pg');

const pool = new Pool(config.get('db'));

module.exports = {
  query: (text: string, params: ?(any[])): Promise<any> => pool.query(text, params),
  connect: async () => pool.connect(),
  end: (cb: () => void) => pool.end(cb),
};
