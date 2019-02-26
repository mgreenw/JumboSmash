const request = require('supertest');
const uuidv4 = require('uuid/v4');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

describe('GET api/users/me/settings', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
  });

  it('should fail if the auth token is not a valid JSON WEB token', async () => {
    const res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', 'this-is-not-a-valid-json-web-token')
      .send({})
      .expect(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED.status);
  });

  it('should error if the user does not exist for the given auth token', async () => {
    const res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', await dbUtils.signToken(1))
      .send({})
      .expect(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED.status);
  });

  it('should succeed if there is a empty body', async () => {
    const user = await dbUtils.createUser('ecolwe02');
    await dbUtils.createProfile(user.id, {
      displayName: 'Emily',
      bio: 'Likes dogs and cats',
      birthday: '1996-05-14',
    });
    const res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({});
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.UPDATE_SETTINGS__SUCCESS.status);
  });

  it('should succeed in updating all of the pronoun preferences', async () => {
    const user = await dbUtils.createUser('ecolwe03');
    await dbUtils.createProfile(user.id, {
      displayName: 'Emily',
      bio: 'Likes dogs and cats',
      birthday: '1996-05-14',
    });
    const res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        lookingForGenders: {
          man: true,
          woman: true,
          nonBinary: true,
        },
        identifyAsGenders: {
          man: true,
          woman: true,
          nonBinary: true,
        },
        activeScenes: {
          smash: true,
          social: true,
          stone: true,
        },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.UPDATE_SETTINGS__SUCCESS.status);

    expect(res.body.data.identifyAsGenders.man).toBe(true);
    expect(res.body.data.identifyAsGenders.woman).toBe(true);
    expect(res.body.data.identifyAsGenders.nonBinary).toBe(true);
    expect(res.body.data.lookingForGenders.man).toBe(true);
    expect(res.body.data.lookingForGenders.woman).toBe(true);
    expect(res.body.data.lookingForGenders.nonBinary).toBe(true);
    expect(res.body.data.activeScenes.smash).toBe(true);
    expect(res.body.data.activeScenes.social).toBe(true);
    expect(res.body.data.activeScenes.stone).toBe(true);
  });

  it('should fail if the the pronoun preferences are not booleans', async () => {
    const user = await dbUtils.createUser('ecolwe04');
    await dbUtils.createProfile(user.id, {
      displayName: 'Emily',
      bio: 'Likes dogs and cats',
      birthday: '1996-05-14',
    });
    const res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        lookingForGenders: {
          man: true,
          woman: true,
          nonBinary: 'true',
        },
        identifyAsGenders: {
          man: true,
          woman: true,
          nonBinary: true,
        },
        activeScenes: {
          smash: true,
          social: true,
          stone: true,
        },
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
  });

  it('should succeed in only updating some of the user settings at once', async () => {
    const user = await dbUtils.createUser('ecolwe05');
    await dbUtils.createProfile(user.id, {
      displayName: 'Rando',
      bio: 'Likes green eggs and ham',
      birthday: '1996-05-14',
    });
    const token = uuidv4();
    const res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        lookingForGenders: {
          man: true,
          nonBinary: true,
        },
        identifyAsGenders: {
          man: true,
        },
        activeScenes: {
          smash: true,
        },
        expoPushToken: token,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.UPDATE_SETTINGS__SUCCESS.status);

    expect(res.body.data.identifyAsGenders).toBeDefined();
    expect(res.body.data.lookingForGenders).toBeDefined();

    expect(res.body.data.identifyAsGenders.man).toBeDefined();
    expect(res.body.data.identifyAsGenders.woman).toBeDefined();
    expect(res.body.data.identifyAsGenders.nonBinary).toBeDefined();
    expect(res.body.data.lookingForGenders.man).toBeDefined();
    expect(res.body.data.lookingForGenders.woman).toBeDefined();
    expect(res.body.data.lookingForGenders.nonBinary).toBeDefined();

    expect(res.body.data.identifyAsGenders.man).toBe(true);
    expect(res.body.data.identifyAsGenders.woman).toBe(false);
    expect(res.body.data.identifyAsGenders.nonBinary).toBe(false);
    expect(res.body.data.lookingForGenders.man).toBe(true);
    expect(res.body.data.lookingForGenders.woman).toBe(false);
    expect(res.body.data.lookingForGenders.nonBinary).toBe(true);
    expect(res.body.data.activeScenes.smash).toBe(true);
    expect(res.body.data.activeScenes.social).toBe(false);
    expect(res.body.data.activeScenes.stone).toBe(false);

    const tokenRes = await db.query('SELECT expo_push_token FROM classmates WHERE id = $1 LIMIT 1', [user.id]);
    expect(tokenRes.rows[0].expo_push_token).toBe(token);
  });
});
