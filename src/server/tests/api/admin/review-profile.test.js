const request = require('supertest');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let other = {};
let third = {};
const adminPassword = 'test-admin-password';

describe('POST api/admin/classmates/:userId/review', () => {
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
      .post('/api/admin/classmates/1/review')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    third = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .post('/api/admin/classmates/1/review')
      .set('Authorization', third.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('must require the user to be an admin and submit the Admin-Authorization header', async () => {
    // Missing admin header
    let res = await request(app)
      .post('/api/admin/classmates/1/review')
      .set('Accept', 'application/json')
      .set('Authorization', other.token);
    // NOTE: this is very specific for admin endpoints: we don't want users to know this exists
    // so we give them a generic 404 if they aren't an admin
    expect(res.statusCode).toBe(404);

    // Non admin with bad password
    res = await request(app)
      .post('/api/admin/classmates/1/review')
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .set('Admin-Authorization', 'bad-auth');
    expect(res.statusCode).toBe(404);

    // Admin with bad password
    res = await request(app)
      .post('/api/admin/classmates/1/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', 'not-the-correct-password');
    expect(res.statusCode).toBe(404);
  });

  it('should require a all fields', async () => {
    let res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({});
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeActiveInScenes: true });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ comment: null });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeActiveInScenes: true, comment: null });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeSwipedOn: true, comment: 'test' });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeSwipedOn: true, canBeActiveInScenes: false });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeSwipedOn: true, canBeActiveInScenes: false, comment: 12344 });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);
  });

  it('should fail given an invalid user id', async () => {
    const res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeSwipedOn: true, canBeActiveInScenes: true, comment: 'No comment' });
    expect(res.body.status).toBe(codes.REVIEW_PROFILE__NOT_FOUND.status);
    expect(res.statusCode).toBe(404);
  });

  it('should fail if the other user has no profile', async () => {
    const res = await request(app)
      .post(`/api/admin/classmates/${third.id}/review`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeSwipedOn: true, canBeActiveInScenes: true, comment: 'No comment' });
    expect(res.body.status).toBe(codes.REVIEW_PROFILE__NOT_FOUND.status);
    expect(res.statusCode).toBe(404);
  });

  it('should fail if a comment is not supplied and one of the two booleans is false', async () => {
    let res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeSwipedOn: false, canBeActiveInScenes: true, comment: null });
    expect(res.body.status).toBe(codes.REVIEW_PROFILE__COMMENT_REQUIRED.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .post('/api/admin/classmates/0/review')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeSwipedOn: true, canBeActiveInScenes: false, comment: null });
    expect(res.body.status).toBe(codes.REVIEW_PROFILE__COMMENT_REQUIRED.status);
    expect(res.statusCode).toBe(400);
  });

  it('should succeed if the user exists', async () => {
    const res = await request(app)
      .post(`/api/admin/classmates/${other.id}/review`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword)
      .send({ canBeSwipedOn: false, canBeActiveInScenes: true, comment: 'No comment' });
    expect(res.body.status).toBe(codes.REVIEW_PROFILE__SUCCESS.status);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.classmate).toBeDefined();
    expect(res.body.data.classmate.id).toBe(other.id);
    expect(res.body.data.classmate.canBeSwipedOn).toBeFalsy();
    expect(res.body.data.classmate.canBeActiveInScenes).toBeTruthy();
    expect(res.body.data.classmate.accountUpdates[0].update.type).toBe('PROFILE_REVIEW');

    expect(res.body.data.classmate.accountUpdates[0].update.canBeSwipedOn).toBeFalsy();
    expect(res.body.data.classmate.accountUpdates[0].update.canBeActiveInScenes).toBeTruthy();
  });
});
