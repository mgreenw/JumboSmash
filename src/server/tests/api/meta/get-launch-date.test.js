const request = require('supertest');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('GET api/meta/launch-date', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE FROM messages');

    me = await dbUtils.createUser('mgreen99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE FROM messages');
  });

  it('must require the user to exist', async () => {
    const res = await request(app)
      .get('/api/meta/launch-date')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should return a launch date', async () => {
    const res = await request(app)
      .get('/api/meta/launch-date')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.body.status).toBe(codes.GET_LAUNCH_DATE__SUCCESS.status);
    expect(res.statusCode).toBe(200);
    const launchDate = new Date(res.body.data.launchDate);
    expect(Number.isNaN(launchDate.getTime())).toBeFalsy();
  });
});
