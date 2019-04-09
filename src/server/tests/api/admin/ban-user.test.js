const request = require('supertest');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let other = {};
let third = {};
const adminPassword = 'test-admin-password';

describe('POST api/admin/ban/:userId', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE FROM messages');

    me = await dbUtils.createUser('mgreen99', true, null, adminPassword);
    other = await dbUtils.createUser('jjaffe99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE FROM messages');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .post('/api/admin/ban/1')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    third = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .post('/api/admin/ban/1')
      .set('Authorization', third.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('must require the user to be an admin and submit the Admin-Authorization header', async () => {
    // Missing admin header
    let res = await request(app)
      .post('/api/admin/ban/1')
      .set('Accept', 'application/json')
      .set('Authorization', other.token);
    // NOTE: this is very specific for admin endpoints: we don't want users to know this exists
    // so we give them a generic 404 if they aren't an admin
    expect(res.statusCode).toBe(404);

    // Non admin with bad password
    res = await request(app)
      .post('/api/admin/ban/1')
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .set('Admin-Authorization', 'bad-auth');
    expect(res.statusCode).toBe(404);

    // Admin with bad password
    res = await request(app)
      .post('/api/admin/ban/1')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', 'not-the-correct-password');
    expect(res.statusCode).toBe(404);
  });

  it('should require a reason', async () => {
    let res = await request(app)
      .post('/api/admin/ban/0')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({});
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .post('/api/admin/ban/0')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ reason: null });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .post('/api/admin/ban/0')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ reason: '' });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    // reason length > 500
    res = await request(app)
      .post('/api/admin/ban/0')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ reason: 'EtWVOpRmrbsy7DRQgYK5qtUfu7LVLQc1lJXiFgVt7tcsRpDmAR8UiiReZVLw9Zqfj5YrVcZhBajoVaN6oJNoBbnNfqa8WzWezxE5bxdPIsjUd2xZkXnkUxqGTOkCsvzvHbKiQpAWGc8ctlRLbjM0g2xexAtsnaOvgSJTyOMPtGoa2MlaiWz1axauRAS8xR9PWHcYfNSQYG11SC7FEygL9F8kwv8UZth495jbHXlBEfAs35lV8sQ6YjpHQ60EglvnGNv7X1WhZO1Ml9uo3U1b9UTRt64sWbeFsEgV8jQZUnTNKHzIg9VtFaZCo4q53w0D7zDZPieN9MCCppgMqcFkcgbRmh7fc8IIAEUiRNMPXweQZGVnphnygYVHJP5qWpLqL2xYsZ89Sq6mwbLwZ0V1MJK2fi0faD4j3pglKzXmd2VBZw8Yfe3YeocuzLTa6ai6xzNBDmPe6zymH5Snf9iP1vXcCjp5Ulu20brbyDGR9ovF3RbHY3gDu' });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);
  });

  it('should fail given an invalid user id', async () => {
    const res = await request(app)
      .post('/api/admin/ban/0')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ reason: 'SPAM' });
    expect(res.body.status).toBe(codes.BAN_USER__USER_NOT_FOUND.status);
    expect(res.statusCode).toBe(400);
  });

  it('should succeed if the user exists', async () => {
    const res = await request(app)
      .post(`/api/admin/ban/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ reason: 'SPAM' });
    expect(res.body.status).toBe(codes.BAN_USER__SUCCESS.status);
    expect(res.statusCode).toBe(200);
  });

  it('should fail if the other user is already banned', async () => {
    const res = await request(app)
      .post(`/api/admin/ban/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ reason: 'SPAM' });
    expect(res.body.status).toBe(codes.BAN_USER__ALREADY_BANNED.status);
    expect(res.statusCode).toBe(409);
  });
});
