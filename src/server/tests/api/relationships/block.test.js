const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('POST api/relationships/judge', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');

    me = await dbUtils.createUser('mgreen99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/relationships/block')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/relationships/block')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should fail if blockedUserId is not a number or not a multiple of 1', async () => {
    let res = await request(app)
      .post('/api/relationships/block')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        blockedUserId: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.blockedUserId should be number');

    res = await request(app)
      .post('/api/relationships/block')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        blockedUserId: 9.3,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.blockedUserId should be multiple of 1');
  });

  it('should not allow a non-existent user to be bloocked', async () => {
    const res = await request(app)
      .post('/api/relationships/block')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        blockedUserId: -1,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BLOCK__USER_NOT_FOUND.status);
  });

  it('should allow a user without a profile setup to be blocked', async () => {
    // Create a user with no profile
    const user = await dbUtils.createUser('testu01');
    const res = await request(app)
      .post('/api/relationships/block')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        blockedUserId: user.id,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.BLOCK__SUCCESS.status);
  });

  it('should allow a user with a profile to be blocked', async () => {
    const user = await dbUtils.createUser('testu02', true);
    const res = await request(app)
      .post('/api/relationships/block')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        blockedUserId: user.id,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.BLOCK__SUCCESS.status);
  });
});
