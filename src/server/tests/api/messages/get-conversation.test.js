const request = require('supertest');

const codes = require('../../../controllers/status-codes');
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
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/messages/1')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE);
  });

  it('should not accept an invalid most recent message id', async () => {
    let res = await request(app)
      .get('/api/messages/9?most-recent-message-id=aaoeu')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID);

    res = await request(app)
      .get('/api/messages/9?most-recent-message-id=-44')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID);
  });

  it('should succeed if the other user exists', async () => {
    let res = await request(app)
      .post(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS);

    res = await request(app)
      .get(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS);

    expect(res.body.messages.length).toBe(1);
    expect(res.body.messages[0].content).toBe('hey');
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
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS);

    expect(res.body.messages.length).toBe(0);
  });
});
