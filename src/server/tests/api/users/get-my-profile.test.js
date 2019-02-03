const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

describe('GET api/users/me/profile', () => {
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
      .get('/api/users/me/profile')
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toEqual(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('mgreen14');
    res = await request(app)
      .get('/api/users/me/profile')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(403);
    expect(res.body.status).toEqual(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should return the profile of the current user', async () => {
    const user = await dbUtils.createUser('mgreen15');
    const profile = {
      displayName: 'Max',
      birthday: '1999-01-07',
      bio: 'Already has a girlfriend so...',
    };

    await dbUtils.createProfile(user.id, profile);
    const res = await request(app)
      .get('/api/users/me/profile')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.status).toEqual(codes.GET_PROFILE__SUCCESS.status);
    expect(res.body.data.profile).toBeDefined();

    expect(res.body.data.profile.displayName).toBe(profile.displayName);
    expect(res.body.data.profile.birthday).toBe(profile.birthday);
    expect(res.body.data.profile.bio).toBe(profile.bio);
  });
});
