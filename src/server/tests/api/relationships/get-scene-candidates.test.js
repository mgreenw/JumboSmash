const request = require('supertest');
const codes = require('../../../controllers/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

describe('GET api/relationships/candidates/:scene', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('mgreen01');
    res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE);
  });

  it('should only allow valid scenes (smash, social, stone)', async () => {
    const user = await dbUtils.createUser('mgreen02');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'test',
      birthday: '1997-09-09',
      image1Url: 'http://www.google.com',
    });
    let res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__SUCCESS);

    res = await request(app)
      .get('/api/relationships/candidates/social')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__SUCCESS);

    res = await request(app)
      .get('/api/relationships/candidates/stone')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__SUCCESS);

    res = await request(app)
      .get('/api/relationships/candidates/smsh')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__INVALID_SCENE);

    res = await request(app)
      .get('/api/relationships/candidates/aoei-aoeuu-aoe')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__INVALID_SCENE);

    res = await request(app)
      .get('/api/relationships/candidates/stinky')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__INVALID_SCENE);

    res = await request(app)
      .get('/api/relationships/candidates')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(404);
  });

  // Check that the response is an array
  // Check that only profiles that are active in a scene show up
  // Check that only profiles that have not yet been liked show up
  // Check that only 10 profiles show up maximum
  // Check that profiles are returned in the correct order
  // check that the correct profiles show up for a given scene
});
