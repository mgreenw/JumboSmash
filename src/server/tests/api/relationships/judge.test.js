const request = require('supertest');
const codes = require('../../../controllers/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me;

describe('POST api/relationships/judge', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');

    me = await dbUtils.createUser('mgreen01', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/relationships/matches')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE);
  });

  // Ensure the candidateUserId is a number and a multiple of 1
  // Ensure 'liked' is a bool
  // Ensure scene is a string and is in "scenes"
  // Ensure another user without a profile cannot be liked
  // Ensure sucess in a normal case
  // Ensure a user that has already been 'liked' can be re-liked and disliked
});
