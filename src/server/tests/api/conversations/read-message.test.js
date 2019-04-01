const request = require('supertest');
const uuidv4 = require('uuid/v4');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let other = {};
let third = {};

describe('PATCH api/conversations/:matchUserId/messages/:messageId', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE FROM messages');
    await db.query('DELETE FROM relationships');

    me = await dbUtils.createUser('mgreen99', true);
    other = await dbUtils.createUser('jjaffe99', true);
    third = await dbUtils.createUser('jjaffe98', true);
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
      .patch('/api/conversations/1/messages/1')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .patch('/api/conversations/1/messages/1')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('must require the other user to exist', async () => {
    const result = await db.query(`
      SELECT COALESCE(SUM(id), 0) AS id from users
    `);

    const [{ id }] = result.rows;

    const res = await request(app)
      .patch(`/api/conversations/${id}/messages/1`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.READ_MESSAGE__NOT_MATCHED.status);
  });

  it('should fail if the other userId or messageid is not an integer', async () => {
    let res = await request(app)
      .patch('/api/conversations/not-an-integer/messages/1')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(404);

    res = await request(app)
      .patch('/api/conversations/1/messages/not-an-integer')
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(404);
  });

  it('should fail if there is no match between the two users', async () => {
    const res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/1`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.READ_MESSAGE__NOT_MATCHED.status);
  });

  it('should fail if the users are matched but the message is not valid', async () => {
    await dbUtils.createRelationship(me.id, other.id, true);
    await dbUtils.createRelationship(other.id, me.id, true);
    const res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/1`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.READ_MESSAGE__MESSAGE_NOT_FOUND.status);
  });

  it('should succeed if there is a new message to read', async () => {
    let res = await request(app)
      .post(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${res.body.data.message.messageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.READ_MESSAGE__SUCCESS.status);
  });

  it('should fail if the message is from the reader', async () => {
    let res = await request(app)
      .post(`/api/conversations/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${res.body.data.message.messageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(409);
    expect(res.body.status).toBe(codes.READ_MESSAGE__FAILURE.status);
    expect(res.body.data.code).toBe('CANNOT_READ_SENT_MESSAGE');
  });

  it('should fail if the message has already been read', async () => {
    let res = await request(app)
      .post(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    const { messageId } = res.body.data.message;

    res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${messageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.READ_MESSAGE__SUCCESS.status);

    res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${messageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(409);
    expect(res.body.status).toBe(codes.READ_MESSAGE__FAILURE.status);
    expect(res.body.data.code).toBe('ALREADY_READ_MESSAGE');
  });

  it('should fail if a message after the given message has already been read', async () => {
    let res = await request(app)
      .post(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    const { messageId: firstMessageId } = res.body.data.message;

    res = await request(app)
      .post(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    const { messageId: secondMessageId } = res.body.data.message;

    res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${secondMessageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.READ_MESSAGE__SUCCESS.status);

    res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${firstMessageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(409);
    expect(res.body.status).toBe(codes.READ_MESSAGE__FAILURE.status);
    expect(res.body.data.code).toBe('GIVEN_MESSAGE_BEFORE_CURRENTLY_READ_MESSAGE');
  });

  it('should fail if the message id is valid but not in the conversation', async () => {
    await dbUtils.createRelationship(third.id, other.id, true);
    await dbUtils.createRelationship(other.id, third.id, true);
    let res = await request(app)
      .post(`/api/conversations/${third.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    const { messageId } = res.body.data.message;

    res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${messageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(409);
    expect(res.body.status).toBe(codes.READ_MESSAGE__FAILURE.status);
    expect(res.body.data.code).toBe('MESSAGE_NOT_IN_CONVERSATION');
  });

  it('should allow both users to read a system message', async () => {
    // Insert a system message
    const result = await db.query(`
      INSERT INTO messages
      (content, sender_user_id, receiver_user_id, unconfirmed_message_uuid, from_system)
      VALUES ('You matched in Smash', $1, $2, $3, true)
      RETURNING id
    `, [me.id, other.id, uuidv4()]);

    const systemMessageId = result.rows[0].id;

    let res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${systemMessageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.READ_MESSAGE__SUCCESS.status);

    res = await request(app)
      .patch(`/api/conversations/${me.id}/messages/${systemMessageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.READ_MESSAGE__SUCCESS.status);
  });
});
