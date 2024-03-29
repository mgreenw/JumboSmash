const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('GET api/photos/sign-url', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from photos');
    await db.query('DELETE from unconfirmed_photos');

    me = await dbUtils.createUser('mgreen99');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from photos');
    await db.query('DELETE from unconfirmed_photos');
  });

  it('must require the user to exist', async () => {
    const res = await request(app)
      .get('/api/photos/sign-url')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should succeed given an authenticated user', async () => {
    const res = await request(app)
      .get('/api/photos/sign-url')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.SIGN_URL__SUCCESS.status);
    expect(res.body.data.url).toContain('https://s3.amazonaws.com/projectgem');
    expect(res.body.data.fields.key).toContain('photos/');
    expect(res.body.data.fields.bucket).toContain('projectgem-');
    expect(res.body.data.fields['X-Amz-Algorithm']).toBe('AWS4-HMAC-SHA256');
    expect(res.body.data.fields['X-Amz-Credential']).toBeDefined();
    expect(res.body.data.fields['X-Amz-Date']).toBeDefined();
    expect(res.body.data.fields.Policy).toBeDefined();
    expect(res.body.data.fields['X-Amz-Signature']).toBeDefined();
  });

  it('should succeed given an authenticated user with a profile', async () => {
    await dbUtils.createProfile(me.id, {
      displayName: 'test user',
      bio: 'is a user',
      birthday: '1997-09-09',
    });
    const res = await request(app)
      .get('/api/photos/sign-url')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.SIGN_URL__SUCCESS.status);
    expect(res.body.data.url).toContain('https://s3.amazonaws.com/projectgem');
    expect(res.body.data.fields.key).toContain('photos/');
    expect(res.body.data.fields.bucket).toContain('projectgem-');
    expect(res.body.data.fields['X-Amz-Algorithm']).toBe('AWS4-HMAC-SHA256');
    expect(res.body.data.fields['X-Amz-Credential']).toBeDefined();
    expect(res.body.data.fields['X-Amz-Date']).toBeDefined();
    expect(res.body.data.fields.Policy).toBeDefined();
    expect(res.body.data.fields['X-Amz-Signature']).toBeDefined();
  });
});
