const request = require('supertest');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let other = {};

describe('GET api/messages/:userId', () => {
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
      .get('/api/messages/1')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/messages/1')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should not accept an invalid most recent message id', async () => {
    let res = await request(app)
      .get('/api/messages/9?most-recent-message-id=aaoeu')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID.status);

    res = await request(app)
      .get('/api/messages/9?most-recent-message-id=-44')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID.status);
  });

  it('should succeed if the other user exists', async () => {
    let res = await request(app)
      .post(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    res = await request(app)
      .get(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].content).toBe('hey');
    expect(res.body.data[0].fromClient).toBe(true);
  });

  it('should succeed if the other user exists', async () => {
    const result = await db.query(`
      SELECT COALESCE(SUM(id), 0) AS id from users
    `);

    const [{ id }] = result.rows;

    const res = await request(app)
      .get(`/api/messages/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);

    expect(res.body.data.length).toBe(0);
  });

  it('should make the message be from the other person if they sent it', async () => {
    let res = await request(app)
      .post(`/api/messages/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ content: 'hey to you too' });

    res = await request(app)
      .get(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data).toBeDefined();
    expect(res.body.data[res.body.data.length - 1].fromClient).toBe(false);
    expect(res.body.data[0].messageId).toBeDefined();
  });

  it('should fail on an invalid most recent message id (string)', async () => {
    const res = await request(app)
      .get(`/api/messages/${other.id}?most-recent-message-id=hahaduped`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID.status);
  });

  it('should fail on an invalid most recent message id (negative)', async () => {
    const res = await request(app)
      .get(`/api/messages/${other.id}?most-recent-message-id=-1`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID.status);
  });

  it('should sucessfully limit the response to 0 messages if the most recent message id is the last message', async () => {
    const result = await db.query(`
      SELECT id
      FROM messages
      WHERE sender_user_id = $1
      ORDER BY timestamp
      LIMIT 1
    `, [other.id]);

    const res = await request(app)
      .get(`/api/messages/${other.id}?most-recent-message-id=${result.rows[0].id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.length).toBe(0);
  });

  it('should sucessfully limit the response to 1 message if the most recent message id is the penultimate message', async () => {
    let res = await request(app)
      .post(`/api/messages/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ content: 'hey to you too' });

    // Gets the penultimate message id
    const result = await db.query(`
      SELECT id
      FROM messages
      WHERE sender_user_id = $1
      ORDER BY timestamp
    `, [other.id]);

    res = await request(app)
      .get(`/api/messages/${other.id}?most-recent-message-id=${result.rows[result.rowCount - 2].id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].messageId).toBe(result.rows[result.rowCount - 1].id);
  });
});
