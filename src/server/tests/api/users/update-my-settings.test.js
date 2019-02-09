const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

describe('GET api/users/me/settings', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
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
        wantPronouns: {
          he: true,
          she: true,
          they: true,
        },
        usePronouns: {
          he: true,
          she: true,
          they: true,
        },
        activeScenes: {
          smash: true,
          social: true,
          stone: true,
        },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.UPDATE_SETTINGS__SUCCESS.status);

    expect(res.body.data.usePronouns.he).toBe(true);
    expect(res.body.data.usePronouns.she).toBe(true);
    expect(res.body.data.usePronouns.they).toBe(true);
    expect(res.body.data.wantPronouns.he).toBe(true);
    expect(res.body.data.wantPronouns.she).toBe(true);
    expect(res.body.data.wantPronouns.they).toBe(true);
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
        wantPronouns: {
          he: true,
          she: true,
          they: 'true',
        },
        usePronouns: {
          he: true,
          she: true,
          they: true,
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
    const res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        wantPronouns: {
          he: true,
          they: true,
        },
        usePronouns: {
          he: true,
        },
        activeScenes: {
          smash: true,
        },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.UPDATE_SETTINGS__SUCCESS.status);

    expect(res.body.data.usePronouns).toBeDefined();
    expect(res.body.data.wantPronouns).toBeDefined();

    expect(res.body.data.usePronouns.he).toBeDefined();
    expect(res.body.data.usePronouns.she).toBeDefined();
    expect(res.body.data.usePronouns.they).toBeDefined();
    expect(res.body.data.wantPronouns.he).toBeDefined();
    expect(res.body.data.wantPronouns.she).toBeDefined();
    expect(res.body.data.wantPronouns.they).toBeDefined();

    expect(res.body.data.usePronouns.he).toBe(true);
    expect(res.body.data.usePronouns.she).toBe(false);
    expect(res.body.data.usePronouns.they).toBe(false);
    expect(res.body.data.wantPronouns.he).toBe(true);
    expect(res.body.data.wantPronouns.she).toBe(false);
    expect(res.body.data.wantPronouns.they).toBe(true);
    expect(res.body.data.activeScenes.smash).toBe(true);
    expect(res.body.data.activeScenes.social).toBe(false);
    expect(res.body.data.activeScenes.stone).toBe(false);
  });
});
