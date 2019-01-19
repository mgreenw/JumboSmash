const request = require('supertest');
const uuidv4 = require('uuid/v4');

const codes = require('../../../controllers/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');
const utils = require('./utils');

let me = {};

describe('DELETE api/photos/:photoId', () => {
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
      .delete('/api/photos/1')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should fail given there is no photo with that id', async () => {
    const res = await request(app)
      .delete('/api/photos/1')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.DELETE_PHOTO__NOT_FOUND);
  });

  it('should fail if the photo belongs to another user', async () => {
    const otherUser = await dbUtils.createUser('jjaffe04');
    const photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 1, $2)
      RETURNING id
    `, [otherUser.id, uuidv4()]);

    const [{ id }] = photoRes.rows;

    const res = await request(app)
      .delete(`/api/photos/${id}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.DELETE_PHOTO__NOT_FOUND);
  });

  it('should fail if the user only has one photo remaining', async () => {
    const photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 1, $2)
      RETURNING id
    `, [me.id, uuidv4()]);

    const [{ id }] = photoRes.rows;

    const res = await request(app)
      .delete(`/api/photos/${id}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO);
  });

  it('should succeed if the photo was properly uploaded', async () => {
    const photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 2, $2)
      RETURNING id
    `, [me.id, uuidv4()]);

    const [{ id }] = photoRes.rows;

    const res = await request(app)
      .delete(`/api/photos/${id}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.DELETE_PHOTO__SUCCESS);
  });

  it('should reorder photos upon deletion', async () => {
    let photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 2, $2)
      RETURNING id
    `, [me.id, uuidv4()]);

    const secondId = photoRes.rows[0].id;

    photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 3, $2)
      RETURNING id
    `, [me.id, uuidv4()]);

    const thirdId = photoRes.rows[0].id;

    const res = await request(app)
      .delete(`/api/photos/${secondId}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.DELETE_PHOTO__SUCCESS);

    photoRes = await db.query(`
      SELECT index
      FROM photos
      WHERE id = $1
    `, [thirdId]);
    expect(photoRes.rows[0].index).toBe(2);
  });
});
