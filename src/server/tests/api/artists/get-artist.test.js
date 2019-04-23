const request = require('supertest');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('GET api/artists/:artistId', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE FROM messages');

    me = await dbUtils.createUser('mgreen99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE FROM messages');
  });

  it('must require the user to exist', async () => {
    const res = await request(app)
      .get('/api/artists/hehe')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should return the artist on a correct artist id', async () => {
    const res = await request(app)
      .get('/api/artists/2TI7qyDE0QfyOlnbtfDo7L')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.body.status).toBe(codes.GET_ARTIST__SUCCESS.status);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.artist.name).toBe('Dave Matthews Band');
    expect(res.body.data.artist.id).toBe('2TI7qyDE0QfyOlnbtfDo7L');
  });

  it('should return not found if the id is bad', async () => {
    const res = await request(app)
      .get('/api/artists/not-a-valid-id')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.body.status).toBe(codes.GET_ARTIST__NOT_FOUND.status);
    expect(res.statusCode).toBe(404);
  });
});
