const request = require('supertest');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let other = {};
let third = {};
const adminPassword = 'test-admin-password';

describe('GET api/admin/classmates', () => {
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
      .get('/api/admin/classmates')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    third = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/admin/classmates')
      .set('Authorization', third.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('must require the user to be an admin and submit the Admin-Authorization header', async () => {
    // Missing admin header
    let res = await request(app)
      .get('/api/admin/classmates')
      .set('Accept', 'application/json')
      .set('Authorization', other.token);
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED.status);

    // Non admin with bad password
    res = await request(app)
      .get('/api/admin/classmates')
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .set('Admin-Authorization', 'bad-auth');
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED.status);

    // Admin with bad password
    res = await request(app)
      .get('/api/admin/classmates')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', 'not-the-correct-password');
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED.status);
  });

  it('should return all classmates given the correct headers', async () => {
    const res = await request(app)
      .get('/api/admin/classmates')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .set('Admin-Authorization', adminPassword);
    expect(res.body.status).toBe(codes.GET_CLASSMATES__SUCCESS.status);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.classmates).toBeDefined();
    expect(res.body.data.classmates.length).toBe(3);
    expect(res.body.data.classmates.filter(c => c.isAdmin).length).toBe(1);
    res.body.data.classmates.forEach((classmate) => {
      expect(classmate.id).toBeDefined();
      expect(classmate.utln).toBeDefined();
      expect(classmate.email).toBeDefined();
      expect(classmate.isBanned).toBeFalsy();
      expect(classmate.activeScenes).toBeDefined();
      expect(classmate.isAdmin).toBeDefined();
    });
  });
});
