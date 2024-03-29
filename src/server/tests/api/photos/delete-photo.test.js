const request = require('supertest');
const uuidv4 = require('uuid/v4');

const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('DELETE api/photos/:photoUuid', () => {
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
      .delete('/api/photos/1')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should fail given there is no photo with that uuid', async () => {
    const res = await request(app)
      .delete('/api/photos/cf9ab9b8-d529-4706-850e-0b9c90e7214e')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.DELETE_PHOTO__NOT_FOUND.status);
  });

  it('should fail if the photo belongs to another user', async () => {
    const otherUser = await dbUtils.createUser('jjaffe04');
    const photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 1, $2)
      RETURNING uuid
    `, [otherUser.id, uuidv4()]);

    const [{ uuid }] = photoRes.rows;

    const res = await request(app)
      .delete(`/api/photos/${uuid}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.DELETE_PHOTO__NOT_FOUND.status);
  });

  it('should succeed if the photo was properly deleted', async () => {
    let photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 1, $2)
      RETURNING uuid
    `, [me.id, uuidv4()]);

    photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 2, $2)
      RETURNING uuid
    `, [me.id, uuidv4()]);

    const [{ uuid }] = photoRes.rows;

    const res = await request(app)
      .delete(`/api/photos/${uuid}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.DELETE_PHOTO__SUCCESS.status);
    expect(res.body.data.length).toBe(1);
  });

  it('should reorder photos upon deletion', async () => {
    let photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 2, $2)
      RETURNING uuid
    `, [me.id, uuidv4()]);

    const secondUuid = photoRes.rows[0].uuid;

    photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 3, $2)
      RETURNING id
    `, [me.id, uuidv4()]);

    const res = await request(app)
      .delete(`/api/photos/${secondUuid}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.DELETE_PHOTO__SUCCESS.status);

    photoRes = await db.query(`
      SELECT index, uuid
      FROM photos
      WHERE user_id = $1
      ORDER BY index
    `, [me.id]);

    expect(photoRes.rows[1].index).toBe(2);
    expect(res.body.data[0]).toBe(photoRes.rows[0].uuid);
  });
});
