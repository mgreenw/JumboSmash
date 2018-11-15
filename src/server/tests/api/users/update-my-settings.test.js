const request = require('supertest');
const codes = require('../../../controllers/status-codes');

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
    expect(res.body.status).toBe(codes.UNAUTHORIZED);
  });

  it('should error if the user does not exist for the given auth token', async () => {
    const res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', dbUtils.signToken(1))
      .send({})
      .expect(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED);
  });

  it('should succeed if the user exists', async () => {
    const user = await dbUtils.createUser('ecolwe02');
    await dbUtils.createProfile(user.id, {
      displayName: 'Emily',
      bio: 'Likes dogs and cats',
      image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      birthday: '1996-05-14',
    });
    const res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({})
      .expect(201);
    console.log(res.body);
    expect(res.body.status).toBe(codes.UPDATE_SETTINGS__SUCCESS);
  });
});
