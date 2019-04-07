const request = require('supertest');

const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let meTwo = {};

describe('POST api/auth/logout', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from photos');
    await db.query('DELETE from unconfirmed_photos');

    me = await dbUtils.createUser('mgreen99');
    meTwo = await dbUtils.createUser('mgreen98');
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
      .post('/api/auth/logout')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should succeed if the user is logged in', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.body.status).toBe(codes.LOGOUT__SUCCESS.status);
    expect(res.statusCode).toBe(200);
  });

  it("should clear the user's auth token and expo push token", async () => {
    let res = await request(app)
      .patch('/api/users/me/settings')
      .set('Accept', 'application/json')
      .set('Authorization', meTwo.token)
      .send({ expoPushToken: 'hey!' });
    expect(res.body.status).toBe(codes.UPDATE_SETTINGS__SUCCESS.status);

    res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', meTwo.token)
      .set('Accept', 'application/json');
    expect(res.body.status).toBe(codes.LOGOUT__SUCCESS.status);
    expect(res.statusCode).toBe(200);

    const result = await db.query(`
      SELECT expo_push_token AS "expoPushToken", token_uuid AS "tokenUUID"
      FROM users
      WHERE id = $1
    `, [meTwo.id]);
    expect(result.rows.length).toBe(1);

    const [{ expoPushToken, tokenUUID }] = result.rows;
    expect(expoPushToken).toBeNull();
    expect(tokenUUID).toBeNull();
  });
});
