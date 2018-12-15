const jwt = require('jsonwebtoken');
const config = require('config');
const uuid = require('uuid/v4');

const db = require('../../db');

function signToken(id) {
  return jwt.sign({ id }, config.secret, {
    expiresIn: 31540000, // expires in 365 days
  });
}

async function insertPhoto(userId, index = 1, photoUUID = uuid()) {
  try {
    const result = await db.query(`
      INSERT INTO photos
      (user_id, index, uuid)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [userId, index, photoUUID]);
    return result.rows[0].id;
  } catch (error) {
    throw new Error('Failed to insert photo');
  }
}

async function createProfile(userId, body) {
  const {
    displayName, birthday, bio,
  } = body;

  if (displayName === undefined
    || birthday === undefined || bio === undefined) {
    throw new Error('Invalid profile supplied to createUser');
  }

  const photoId = await insertPhoto(userId, 1);

  try {
    const result = await db.query(`
      INSERT INTO profiles
      (user_id, display_name, birthday, bio, splash_photo_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id AS "userId"
    `,
    [userId, displayName, birthday, bio, photoId]);

    return result.rows[0].userId;
  } catch (error) {
    throw new Error('Failed to insert profile');
  }
}

async function createUser(utln, useDefaultProfile = false, profileBody = null) {
  const email = `${utln}@tufts.edu`;

  try {
    const result = await db.query(`
    INSERT INTO users
      (utln, email)
      VALUES ($1, $2)
    RETURNING id`, [utln, email]);

    const { id } = result.rows[0];

    if (useDefaultProfile || profileBody !== null) {
      const defaultProfile = {
        displayName: 'test user',
        bio: 'is a user',
        birthday: '1997-09-09',
      };

      const body = useDefaultProfile ? defaultProfile : profileBody;
      const profile = await createProfile(id, body);

      return {
        id,
        token: signToken(id),
        profile: {
          userId: profile,
          ...body,
        },
      };
    }

    return {
      id,
      token: signToken(id),
    };
  } catch (error) {
    throw new Error('Failed to insert user');
  }
}

async function updateSettings(id, settings) {
  const {
    wantHe,
    wantShe,
    wantThey,
    useHe,
    useShe,
    useThey,
    activeSmash,
    activeStone,
    activeSocial,
  } = settings;

  try {
    await db.query(`
    UPDATE users
      SET (want_he, want_she, want_they, use_he, use_she, use_they, active_smash, active_social, active_stone)
      = ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    WHERE id = $10
    `, [wantHe, wantShe, wantThey, useHe, useShe, useThey, activeSmash, activeSocial, activeStone, id]);

    return true;
  } catch (error) {
    return false;
  }
}

async function createRelationship(
  critic,
  candidate,
  likedSmash = false,
  likedSocial = false,
  likedStone = false,
  blocked = false,
) {
  try {
    await db.query(`
      INSERT INTO relationships
      (critic_user_id, candidate_user_id, liked_smash, liked_social, liked_stone, blocked)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [critic, candidate, likedSmash, likedSocial, likedStone, blocked]);
    return true;
  } catch (error) {
    return false;
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
  createRelationship,
  insertPhoto,
};
