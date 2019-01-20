const request = require('supertest');
const uuidv4 = require('uuid/v4');

const codes = require('../../../controllers/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');
const utils = require('./utils');

let me = {};


describe('GET api/photos/confirm_upload', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from photos');
    await db.query('DELETE from unconfirmed_photos');

    me = await dbUtils.createUser('mgreen99');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
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
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should fail given there is no unconfirmed photo', async () => {
    const res = await request(app)
      .get('/api/photos/confirm-upload')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.CONFIRM_UPLOAD__NO_UNCONFIRMED_PHOTO);
  });

  it('should fail if a photo was not actually uploaded', async () => {
    let res = await request(app)
      .get('/api/photos/sign-url')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.SIGN_URL__SUCCESS);

    res = await request(app)
      .get('/api/photos/confirm-upload')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.CONFIRM_UPLOAD__NO_UPLOAD_FOUND);
  });

  it('should succeed if the photo was properly uploaded', async () => {
    let res = await request(app)
      .get('/api/photos/sign-url')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.SIGN_URL__SUCCESS);

    // Perform the file upload
    await utils.uploadTestPhoto(res.body.payload);
    const { key } = res.body.payload.fields;

    res = await request(app)
      .get('/api/photos/confirm-upload')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.CONFIRM_UPLOAD__SUCCESS);
    expect(Number.isInteger(res.body.photoId) && res.body.photoId > 0).toBeTruthy();

    await utils.deletePhoto(key);
  });

  it('should fail if there are already four confirmed photos', async () => {
    // Insert three other "fake" photos.
    await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 2, $2),
        ($3, 3, $4),
        ($5, 4, $6)
    `, [me.id, uuidv4(), me.id, uuidv4(), me.id, uuidv4()]);

    let res = await request(app)
      .get('/api/photos/sign-url')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.SIGN_URL__SUCCESS);

    // Perform the file upload
    await utils.uploadTestPhoto(res.body.payload);

    const { key } = res.body.payload.fields;

    res = await request(app)
      .get('/api/photos/confirm-upload')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.CONFIRM_UPLOAD__NO_AVAILABLE_SLOT);

    await utils.deletePhoto(key);
  });
});
