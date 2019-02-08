const request = require('supertest');
const uuidv4 = require('uuid/v4');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('GET api/users/me/photos', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE FROM photos');

    me = await dbUtils.createUser('mgreen99');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE FROM photos');
  });

  it('must require the user to exist', async () => {
    const res = await request(app)
      .get('/api/users/me/photos')
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should succeed if the user exists and return the users photos', async () => {
    let photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 1, $2)
      RETURNING id
    `, [me.id, uuidv4()]);

    const firstId = photoRes.rows[0].id;

    photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 2, $2)
      RETURNING id
    `, [me.id, uuidv4()]);

    const secondId = photoRes.rows[0].id;

    const res = await request(app)
      .get('/api/users/me/photos')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MY_PHOTOS__SUCCESS.status);
    expect(res.body.data).toEqual([firstId, secondId]);
  });
});
