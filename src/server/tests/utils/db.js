const jwt = require('jsonwebtoken');
const config = require('config');

const db = require('../../db');

function signToken(id) {
  return jwt.sign({ id }, config.secret, {
    expiresIn: 31540000, // expires in 365 days
  });
}

async function createUser(utln, username = null) {
  const email = `${username || utln}@tufts.edu`;

  const result = await db.query(`
    INSERT INTO users
      (utln, email)
      VALUES ($1, $2)
    ON CONFLICT (utln)
      DO UPDATE
        SET successful_logins = users.successful_logins + EXCLUDED.successful_logins
    RETURNING id`, [utln, email]);

  const { id } = result.rows[0];

  return {
    id,
    token: signToken(id),
  };
}

async function createProfile(userId, body) {
  const {
    displayName, birthday, image1Url, image2Url, image3Url, image4Url, bio,
  } = body;

  if (displayName === undefined
    || birthday === undefined || image1Url === undefined || bio === undefined) {
    throw new Error('Invalid profile supplied to createUser');
  }

  const result = await db.query(`
    INSERT INTO profiles
    (user_id, display_name, birthday, image1_url, image2_url, image3_url, image4_url, bio)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT DO NOTHING
    RETURNING id
  `,
  [userId, displayName, birthday, image1Url, image2Url, image3Url, image4Url, bio]);

  return result.rows[0].id;
}

async function deleteProfile(userId) {
  await db.query(`
    DELETE from profiles
    WHERE user_id = $1
  `,
  [userId]);
}

async function deleteUser(userId) {
  await db.query(`
    DELETE from users
    WHERE id = $1
  `,
  [userId]);
}

module.exports = {
  createProfile,
  createUser,
  deleteProfile,
  deleteUser,
  signToken,
};
