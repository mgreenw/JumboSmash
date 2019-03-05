const request = require('supertest');
const uuidv4 = require('uuid/v4');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let other = {};

describe('POST api/messages/:userId', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE FROM messages');
    await db.query('DELETE FROM relationships');

    me = await dbUtils.createUser('mgreen99', true);
    other = await dbUtils.createUser('jjaffe99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE FROM relationships');
    await db.query('DELETE FROM messages');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .post('/api/messages/1')
      .set('Accept', 'application/json')
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .post('/api/messages/1')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .send({ content: 'hey there', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
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
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__USER_NOT_FOUND.status);
  });

  it('should fail if the other userId is not an integer', async () => {
    const res = await request(app)
      .post('/api/messages/not-an-integer')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(404);
  });

  it('should fail if there is no match between the two users', async () => {
    const res = await request(app)
      .post(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__USER_NOT_FOUND.status);
  });

  it('should succeed if the other user exists', async () => {
    dbUtils.createRelationship(me.id, other.id, true);
    dbUtils.createRelationship(other.id, me.id, true);
    const res = await request(app)
      .post(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.message.fromClient).toBe(true);
    expect(res.body.data.message.messageId).toBeDefined();
    // The first message should have no prev message id
    expect(res.body.data.previousMessageId).toBeNull();
  });

  it('should fail if the unconfirmed message uuid is not provided', async () => {
    const res = await request(app)
      .post(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toContain("data should have required property 'unconfirmedMessageUuid'");
  });

  it('should fail if the unconfirmed message uuid is not a valid uuid/v4', async () => {
    const res = await request(app)
      .post(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey', unconfirmedMessageUuid: 'heyjacob-itsmax-thisisntauuid-youduped' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toContain('data.unconfirmedMessageUuid should match format "uuid"');
  });

  it('should return the provided unconfirmedMessageUuid', async () => {
    const uuid = uuidv4();
    const res = await request(app)
      .post(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuid });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);
    expect(res.body.data.message.unconfirmedMessageUuid).toBe(uuid);
  });

  it('should return the id of the previous message', async () => {
    let res = await request(app)
      .post(`/api/messages/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);
    const { messageId } = res.body.data.message;

    res = await request(app)
      .post(`/api/messages/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ content: 'hey back', unconfirmedMessageUuid: uuidv4() });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);
    expect(res.body.data.previousMessageId).toBe(messageId);
  });
});
