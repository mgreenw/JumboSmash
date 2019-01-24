const request = require('supertest');
const codes = require('../../../controllers/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let user = null;
let otherUser = null;
let userNoProfile = null;

describe('GET api/users/:userId/profile', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');

    // Create a user with a profile
    user = await dbUtils.createUser('mgreen15');
    user.profile = {
      displayName: 'Max',
      birthday: '1999-01-07',
      bio: 'Already has a girlfriend so...',
    };
    await dbUtils.createProfile(user.id, user.profile);

    // Create "other user" with a valid profile
    otherUser = await dbUtils.createUser('mgreen16');
    otherUser.profile = {
      displayName: 'Max16',
      birthday: '1999-01-27',
      bio: 'Already has 2 friends so...',
    };
    await dbUtils.createProfile(otherUser.id, otherUser.profile);

    userNoProfile = await dbUtils.createUser('mgreen00');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
  });

  it('must require the requesting user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/users/1/profile')
      .set('Accept', 'application/json');
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');

    const tempUser = await dbUtils.createUser('mgreen14');
    res = await request(app)
      .get('/api/users/1/profile')
      .set('Authorization', tempUser.token)
      .set('Accept', 'application/json')
      .expect(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE);
  });

  it('should be able to get the current user profile', async () => {
    const res = await request(app)
      .get(`/api/users/${user.id}/profile`)
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.status).toBe(codes.GET_PROFILE__SUCCESS);
    expect(res.body.profile).toBeDefined();

    expect(res.body.profile.displayName).toBe(user.profile.displayName);
    expect(res.body.profile.birthday).toBe(user.profile.birthday);
    expect(res.body.profile.bio).toBe(user.profile.bio);
    expect(res.body.profile.photos).toBeDefined();
    expect(res.body.profile.photos[0] > 0).toBeTruthy();
  });

  it('should be able to get the another user profile', async () => {
    const res = await request(app)
      .get(`/api/users/${otherUser.id}/profile`)
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.status).toBe(codes.GET_PROFILE__SUCCESS);
    expect(res.body.profile).toBeDefined();

    expect(res.body.profile.displayName).toBe(otherUser.profile.displayName);
    expect(res.body.profile.birthday).toBe(otherUser.profile.birthday);
    expect(res.body.profile.bio).toBe(otherUser.profile.bio);
  });

  it('should fail to get another user profile if that user has not setup a profile', async () => {
    const res = await request(app)
      .get(`/api/users/${userNoProfile.id}/profile`)
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(404);
    expect(res.body.status).toBe(codes.GET_PROFILE__PROFILE_NOT_FOUND);
  });

  it('should error if the user id is not an integer', async () => {
    await request(app)
      .get('/api/users/BAD-INT/profile')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(404);
  });

  it('should error if the user does not exist', async () => {
    const res = await request(app)
      .get('/api/users/99999999/profile')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(404);
    expect(res.body.status).toBe(codes.GET_PROFILE__PROFILE_NOT_FOUND);
  });
});
