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

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/users/me/settings')
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('mgreen14');
    res = await request(app)
      .get('/api/users/me/profile')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should return the settings of the current user', async () => {
    const user = await dbUtils.createUser('mgreen15');
    const profile = {
      displayName: 'Max',
      birthday: '1999-01-07',
      bio: 'Hates dogs and realizes that it is not a popular opinion. Sorry Jillian',
    };

    await dbUtils.createProfile(user.id, profile);
    const res = await request(app)
      .get('/api/users/me/settings')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.status).toBe(codes.GET_SETTINGS__SUCCESS.status);
    expect(res.body.data).toBeDefined();

    expect(res.body.data.identifyAsGenders).toBeDefined();
    expect(res.body.data.lookingForGenders).toBeDefined();

    expect(res.body.data.identifyAsGenders.man).toBeDefined();
    expect(res.body.data.identifyAsGenders.woman).toBeDefined();
    expect(res.body.data.identifyAsGenders.nonBinary).toBeDefined();
    expect(res.body.data.lookingForGenders.man).toBeDefined();
    expect(res.body.data.lookingForGenders.woman).toBeDefined();
    expect(res.body.data.lookingForGenders.nonBinary).toBeDefined();

    expect(res.body.data.activeScenes.smash).toBeDefined();
    expect(res.body.data.activeScenes.social).toBeDefined();
    expect(res.body.data.activeScenes.stone).toBeDefined();

    // Default to false
    expect(res.body.data.activeScenes.smash).toBe(false);
    expect(res.body.data.activeScenes.social).toBe(false);
    expect(res.body.data.activeScenes.stone).toBe(false);
  });
});
