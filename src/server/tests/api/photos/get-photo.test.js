const request = require('supertest');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');
const utils = require('./utils');

let me = {};
let photoUuid;

describe('GET api/photos/:photoUuid', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from classmates');
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from photos');
    await db.query('DELETE from unconfirmed_photos');

    me = await dbUtils.createUser('mgreen99');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from classmates');
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

  it('should fail given there is no photo for that id', async () => {
    const res = await request(app)
      .get('/api/photos/79d9ddb5-4823-422c-b5b0-e0feb5b82edd')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_PHOTO__NOT_FOUND.status);
  });

  it('should succeed if there is a photo with the given id', async () => {
    let res = await request(app)
      .get('/api/photos/sign-url')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.SIGN_URL__SUCCESS.status);

    // Perform the file upload
    await utils.uploadTestPhoto(res.body.data);

    const { key } = res.body.data.fields;

    res = await request(app)
      .get('/api/photos/confirm-upload')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.CONFIRM_UPLOAD__SUCCESS.status);
    expect(res.body.data.length).toBe(1);

    photoUuid = res.body.data[res.body.data.length - 1];

    res = await request(app)
      .get(`/api/photos/${photoUuid}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .redirects(1);
    expect(res.statusCode).toBe(200);
    expect(res.redirects[0]).toContain('https://projectgem');
    expect(res.redirects[0]).toContain('.s3.amazonaws.com');
    expect(res.header['content-type']).toBe('image/jpeg');

    await utils.deletePhoto(key);
  });

  it('should fail if the user is terminated', async () => {
    await dbUtils.terminateUser(me.id);
    const person = await dbUtils.createUser('person04', true);

    const res = await request(app)
      .get(`/api/photos/${photoUuid}`)
      .set('Authorization', person.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_PHOTO__NOT_FOUND.status);
  });
});
