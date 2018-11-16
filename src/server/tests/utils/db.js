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

  try {
    const result = await db.query(`
    INSERT INTO users
      (utln, email)
      VALUES ($1, $2)
    RETURNING id`, [utln, email]);

    const { id } = result.rows[0];

    return {
      id,
      token: signToken(id),
    };
  } catch (error) {
    throw new Error('Failed to insert user');
  }
}

async function updateSettings(utln, settings) {
  const {
    wantsHe,
    wantsShe,
    wantsThey,
    usesHe,
    usesShe,
    usesThey,
  } = settings;

  try {
    const result = await db.query(`
    INSERT INTO users
      (utln, wantsHe, wantsShe, wantsThey, usesHe, usesShe, usesThey)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id`, [utln, wantsHe, wantsShe, wantsThey, usesHe, usesShe,
      usesThey]);

    const { id } = result.rows[0];

    return {
      id,
      token: signToken(id),
    };
  } catch (error) {
    throw new Error('Failed to insert user');
  }
}

async function createProfile(userId, body) {
  const {
    displayName, birthday, image1Url, image2Url, image3Url, image4Url, bio,
  } = body;

  if (displayName === undefined
    || birthday === undefined || image1Url === undefined || bio === undefined) {
    throw new Error('Invalid profile supplied to createUser');
  }

  try {
    const result = await db.query(`
      INSERT INTO profiles
      (user_id, display_name, birthday, image1_url, image2_url, image3_url, image4_url, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `,
    [userId, displayName, birthday, image1Url, image2Url, image3Url, image4Url, bio]);

    return result.rows[0].id;
  } catch (error) {
    throw new Error('Failed to insert profile');
  }
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
  updateSettings,
  signToken,
};
