// @flow

const db = require('../../db');

async function userIsBanned(userId: number): Promise<boolean> {
  const result = await db.query(`
    SELECT banned
    FROM classmates
    WHERE id = $1
  `, [userId]);

  if (result.rowCount === 0) return true;
  return result.rows[0].banned === true;
}

module.exports = userIsBanned;
