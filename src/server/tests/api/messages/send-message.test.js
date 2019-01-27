const request = require('supertest');

const codes = require('../../../controllers/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let other = {};

describe('POST api/messages/:userId', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE FROM messages');

    me = await dbUtils.createUser('mgreen99', true);
    other = await dbUtils.createUser('jjaffe99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE FROM messages');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .post('/api/messages/1')
      .set('Accept', 'application/json')
      .send({ content: 'hey' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .post('/api/messages/1')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .send({ content: 'hey there' });
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE);
  });

  it('must require the other user to exist', async () => {
    const result = await db.query(`
      SELECT COALESCE(SUM(id), 0) AS id from users
    `);

    const [{ id }] = result.rows;

    const res = await request(app)
      .post(`/api/messages/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__USER_NOT_FOUND);
  });

  it('should fail if the other userId is not an integer', async () => {
    const res = await request(app)
      .post('/api/messages/not-an-integer')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey' });
    expect(res.statusCode).toBe(404);
  });

  it('should succeed if the other user exists', async () => {
    const res = await request(app)
      .post(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS);
    expect(res.body.message).toBeDefined();
    expect(res.body.message.senderUserId).toBe(me.id);
    expect(res.body.message.receiverUserId).toBe(other.id);
    expect(res.body.message.id).toBeDefined();
  });
});
