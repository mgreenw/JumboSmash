const request = require('supertest');
const uuidv4 = require('uuid/v4');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let other = {};

describe('GET api/conversations/:userId', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE FROM messages');

    me = await dbUtils.createUser('mgreen99', true);
    other = await dbUtils.createUser('jjaffe99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE FROM messages');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/conversations/1')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/conversations/1')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should fail if there is no match', async () => {
    await db.query(`
      INSERT INTO MESSAGES
      (sender_user_id, receiver_user_id, content, unconfirmed_message_uuid)
      VALUES ($1, $2, $3, $4)
    `, [me.id, other.id, 'hey', uuidv4()]);

    const res = await request(app)
      .get(`/api/conversations/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__NOT_MATCHED.status);
    await db.query('DELETE FROM messages');
  });

  it('should not accept an invalid most recent message id', async () => {
    await dbUtils.createRelationship(me.id, other.id, true);
    await dbUtils.createRelationship(other.id, me.id, true);
    let res = await request(app)
      .get(`/api/conversations/${other.id}?most-recent-message-id=aaoeu`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID.status);

    res = await request(app)
      .get(`/api/conversations/${other.id}?most-recent-message-id=-44`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID.status);
  });

  it('should succeed if the other user exists', async () => {
    let res = await request(app)
      .post(`/api/conversations/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ unconfirmedMessageUuid: uuidv4(), content: 'hey' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    res = await request(app)
      .get(`/api/conversations/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);

    expect(res.body.data.messages.length).toBe(1);
    expect(res.body.data.messages[0].content).toBe('hey');
    expect(res.body.data.messages[0].sender).toBe('client');
    expect(res.body.data.readReceipt).toBeNull();
    // We sent them a message so it is read!
    expect(res.body.data.conversationIsRead).toBeTruthy();
  });

  it('should fail if the other user does not exist', async () => {
    const result = await db.query(`
      SELECT COALESCE(SUM(id), 0) AS id from users
    `);

    const [{ id }] = result.rows;

    const res = await request(app)
      .get(`/api/conversations/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__NOT_MATCHED.status);
  });

  it('should make the message be from the other person if they sent it', async () => {
    let res = await request(app)
      .post(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ unconfirmedMessageUuid: uuidv4(), content: 'hey to you too' });

    res = await request(app)
      .get(`/api/conversations/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.messages).toBeDefined();
    expect(res.body.data.messages[res.body.data.messages.length - 1].sender).toBe('match');
    expect(res.body.data.messages[0].messageId).toBeDefined();
    expect(res.body.data.readReceipt).toBeNull();
    expect(res.body.data.conversationIsRead).toBeFalsy();
  });

  it('should fail on an invalid most recent message id (string)', async () => {
    const res = await request(app)
      .get(`/api/conversations/${other.id}?most-recent-message-id=hahaduped`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__INVALID_MOST_RECENT_MESSAGE_ID.status);
  });

  it('should fail on an invalid most recent message id (negative)', async () => {
    const res = await request(app)
      .get(`/api/conversations/${other.id}?most-recent-message-id=-1`)
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
      .get(`/api/conversations/${other.id}?most-recent-message-id=${result.rows[0].id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.messages.length).toBe(0);
    expect(res.body.data.readReceipt).toBeNull();
    expect(res.body.data.conversationIsRead).toBeFalsy();
  });

  it('should sucessfully limit the response to 1 message if the most recent message id is the penultimate message', async () => {
    let res = await request(app)
      .post(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ unconfirmedMessageUuid: uuidv4(), content: 'hey to you too' });

    // Gets the penultimate message id
    const result = await db.query(`
      SELECT id
      FROM messages
      WHERE sender_user_id = $1
      ORDER BY timestamp
    `, [other.id]);

    res = await request(app)
      .get(`/api/conversations/${other.id}?most-recent-message-id=${result.rows[result.rowCount - 2].id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.messages.length).toBe(1);
    expect(res.body.data.messages[0].messageId).toBe(result.rows[result.rowCount - 1].id);
    expect(res.body.data.readReceipt).toBeNull();
    expect(res.body.data.conversationIsRead).toBeFalsy();
  });

  it('should fail if the other user is banned', async () => {
    const person = await dbUtils.createUser('person04', true);
    await dbUtils.createRelationship(person.id, me.id, true);
    await dbUtils.createRelationship(me.id, person.id, true);

    let res = await request(app)
      .post(`/api/conversations/${person.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ unconfirmedMessageUuid: uuidv4(), content: 'hey I will ban you' });
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    await dbUtils.banUser(person.id);

    res = await request(app)
      .get(`/api/conversations/${person.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__NOT_MATCHED.status);
  });

  it('should update the read receipt based on the other users read status', async () => {
    let res = await request(app)
      .post(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ unconfirmedMessageUuid: uuidv4(), content: 'read this' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    const { messageId: firstMessageId } = res.body.data.message;

    res = await request(app)
      .get(`/api/conversations/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);

    expect(res.body.data.messages[res.body.data.messages.length - 1].content).toBe('read this');
    expect(res.body.data.messages[res.body.data.messages.length - 1].sender).toBe('match');
    expect(res.body.data.readReceipt).toBeNull();
    // We sent them a message so it is read!
    expect(res.body.data.conversationIsRead).toBeFalsy();

    res = await request(app)
      .post(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token)
      .send({ unconfirmedMessageUuid: uuidv4(), content: 'read this #2' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    const { messageId: secondMessageId } = res.body.data.message;

    res = await request(app)
      .get(`/api/conversations/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);

    expect(res.body.data.messages[res.body.data.messages.length - 1].content).toBe('read this #2');
    expect(res.body.data.messages[res.body.data.messages.length - 1].sender).toBe('match');
    expect(res.body.data.readReceipt).toBeNull();
    // We sent them a message so it is read!
    expect(res.body.data.conversationIsRead).toBeFalsy();

    // Read the first message
    res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${firstMessageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.READ_MESSAGE__SUCCESS.status);
    const { readTimestamp: firstReadTimestamp } = res.body.data;

    res = await request(app)
      .get(`/api/conversations/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.messages[res.body.data.messages.length - 1].content).toBe('read this #2');
    expect(res.body.data.messages[res.body.data.messages.length - 1].sender).toBe('match');
    expect(res.body.data.readReceipt).toBeNull();

    // However, the conversation should be unread because we have not yet read the last message
    expect(res.body.data.conversationIsRead).toBeFalsy();

    // Ensure other has read all their messages
    res = await request(app)
      .get(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.messages.length > 0).toBeTruthy();

    // // Other should read the last message
    const { messageId } = res.body.data.messages.reverse().find(message => message.sender === 'match');
    res = await request(app)
      .patch(`/api/conversations/${me.id}/messages/${messageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.READ_MESSAGE__SUCCESS.status);

    res = await request(app)
      .get(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.messages[res.body.data.messages.length - 1].content).toBe('read this #2');
    expect(res.body.data.messages[res.body.data.messages.length - 1].sender).toBe('client');
    expect(res.body.data.readReceipt.messageId).toBe(firstMessageId);
    expect(res.body.data.readReceipt.timestamp).toEqual(firstReadTimestamp);
    expect(res.body.data.conversationIsRead).toBeTruthy();

    // Read the second message
    res = await request(app)
      .patch(`/api/conversations/${other.id}/messages/${secondMessageId}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.READ_MESSAGE__SUCCESS.status);
    const { readTimestamp: secondMessageTimestamp } = res.body.data;

    res = await request(app)
      .get(`/api/conversations/${other.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.messages[res.body.data.messages.length - 1].content).toBe('read this #2');
    expect(res.body.data.messages[res.body.data.messages.length - 1].sender).toBe('match');
    expect(res.body.data.readReceipt).not.toBeNull();
    // It should now be read
    expect(res.body.data.conversationIsRead).toBeTruthy();

    res = await request(app)
      .get(`/api/conversations/${me.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', other.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_CONVERSATION__SUCCESS.status);
    expect(res.body.data.messages[res.body.data.messages.length - 1].content).toBe('read this #2');
    expect(res.body.data.messages[res.body.data.messages.length - 1].sender).toBe('client');
    expect(res.body.data.readReceipt.messageId).toBe(secondMessageId);
    expect(res.body.data.readReceipt.timestamp).toEqual(secondMessageTimestamp);
    expect(res.body.data.conversationIsRead).toBeTruthy();
  });
});
