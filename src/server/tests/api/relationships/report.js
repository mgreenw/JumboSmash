const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('POST api/relationships/report', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');

    me = await dbUtils.createUser('mgreen99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .post('/api/relationships/report')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .post('/api/relationships/report')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should fail if userId is not a number or not a multiple of 1', async () => {
    let res = await request(app)
      .post('/api/relationships/report')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        userId: true,
        message: 'Bad person',
        reasonCode: 'GOOD_REASON',
        block: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.userId should be number');

    res = await request(app)
      .post('/api/relationships/report')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        userId: 9.3,
        message: 'Bad person',
        reasonCode: 'GOOD_REASON',
        block: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.userId should be multiple of 1');
  });

  it('should not allow a non-existent user to be bloocked', async () => {
    const res = await request(app)
      .post('/api/relationships/report')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        userId: -1,
        message: 'Bad person',
        reasonCode: 'GOOD_REASON',
        block: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.REPORT__USER_NOT_FOUND.status);
  });

  it('should allow a user without a profile setup to be reported', async () => {
    // Create a user with no profile
    const user = await dbUtils.createUser('testu01');
    const res = await request(app)
      .post('/api/relationships/report')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        userId: user.id,
        message: 'Bad person',
        reasonCode: 'GOOD_REASON',
        block: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.REPORT__SUCCESS.status);
  });

  it('should allow a user with a profile to be reported', async () => {
    const user = await dbUtils.createUser('testu02', true);
    const res = await request(app)
      .post('/api/relationships/report')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        userId: user.id,
        message: 'Bad person',
        reasonCode: 'GOOD_REASON',
        block: false,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.REPORT__SUCCESS.status);
  });

  it('should actually block the user', async () => {
    const user = await dbUtils.createUser('testu05', true);
    const res = await request(app)
      .post('/api/relationships/report')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        userId: user.id,
        message: 'Bad person',
        reasonCode: 'GOOD_REASON',
        block: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.REPORT__SUCCESS.status);

    const [{ blocked }] = (await db.query('SELECT blocked FROM relationships WHERE critic_user_id = $1 AND candidate_user_id = $2', [me.id, user.id])).rows;
    expect(blocked).toBeTruthy();
  });
});
