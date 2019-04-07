const request = require('supertest');
const uuidv4 = require('uuid/v4');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me;

type User = {
  id: number,
  token: string,
};

async function judge(critic: User, candidate: User, scene: string, liked: boolean = true) {
  const response = await request(app)
    .post('/api/relationships/judge')
    .set('Authorization', critic.token)
    .set('Accept', 'application/json')
    .send({
      candidateUserId: candidate.id,
      scene,
      liked,
    });

  expect(response.body.status).toBe(codes.JUDGE__SUCCESS.status);
  return response;
}

describe('GET api/relationships/matches', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from messages');

    me = await dbUtils.createUser('mgreen01', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from classmates');
    await db.query('DELETE from messages');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/relationships/matches')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should not return any matches if the user has no relationships', async () => {
    const res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS.status);
  });

  it('should return a match given a relationship with inverse likes on smash', async () => {
    const other = await dbUtils.createUser('person01', true);
    await judge(me, other, 'smash', true);
    await judge(other, me, 'smash', true);

    const res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS.status);
    expect(res.body.data.length).toBe(1);
    const match = res.body.data[0];
    expect(match.userId).toBe(other.id);

    expect(match.scenes.smash).toBeDefined();
    expect(match.scenes.smash).not.toBeNull();
    expect(match.scenes.social).toBeNull();
    expect(match.scenes.stone).toBeNull();
  });


  it('should return a match given a relationship with inverse likes on all scenes', async () => {
    const personOne = await dbUtils.createUser('person02', true);
    const personTwo = await dbUtils.createUser('random01', true);

    await judge(personTwo, personOne, 'smash', true);
    await judge(personOne, personTwo, 'smash', true);

    await judge(personTwo, personOne, 'social', true);
    await judge(personOne, personTwo, 'social', true);

    await judge(personTwo, personOne, 'stone', true);
    await judge(personOne, personTwo, 'stone', true);

    const res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', personTwo.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS.status);
    expect(res.body.data.length).toBe(1);

    const [match] = res.body.data;
    // NOTE: this tests ordering by 'last match date' if messages are null
    expect(match.userId).toBe(personOne.id);
    expect(match.scenes.smash).not.toBeNull();
    expect(match.scenes.social).not.toBeNull();
    expect(match.scenes.stone).not.toBeNull();
  });

  it('should return a match given a relationship with inverse likes on smash', async () => {
    const person = await dbUtils.createUser('person03', true);
    await dbUtils.createRelationship(me.id, person.id, true, true, true);
    await dbUtils.createRelationship(person.id, me.id, true, true, true, true); // block
    const res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS.status);
    // We should not recieve a result for the blocked one
    expect(res.body.data.length).toBe(1);
  });

  it('should not get a match with a blocked user', async () => {
    const person = await dbUtils.createUser('person04', true);
    await dbUtils.createRelationship(me.id, person.id, true, true, true);
    await dbUtils.createRelationship(person.id, me.id, true, true, true);
    await dbUtils.banUser(person.id);
    const res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS.status);
    // We should not recieve a result for the banned one
    expect(res.body.data.length).toBe(1);
  });

  it('should return the most recent message and if the conversation is read between the users', async () => {
    const personFive = await dbUtils.createUser('person05', true);
    const personSix = await dbUtils.createUser('person06', true);
    await dbUtils.createRelationship(personFive.id, personSix.id, true, true, true);
    await dbUtils.createRelationship(personSix.id, personFive.id, true, true, true);
    let res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', personFive.token)
      .set('Accept', 'application/json');
    const matchIds = res.body.data.map((match) => {
      expect(match.mostRecentMessage).toBeNull();
      expect(match.conversationIsRead).toBeTruthy();
      return match.userId;
    });

    res = await request(app)
      .post(`/api/conversations/${personFive.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', personSix.token)
      .send({ content: 'hey', unconfirmedMessageUuid: uuidv4() });
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    const { messageId } = res.body.data.message;

    res = await request(app)
      .post(`/api/conversations/${matchIds[0]}`)
      .set('Accept', 'application/json')
      .set('Authorization', personFive.token)
      .send({ content: 'hey back', unconfirmedMessageUuid: uuidv4() });
    expect(res.body.status).toBe(codes.SEND_MESSAGE__SUCCESS.status);

    res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', personFive.token)
      .set('Accept', 'application/json');

    // User should be at the end of the list now
    let [match] = res.body.data;
    expect(match.mostRecentMessage.content).toBe('hey back');
    expect(match.mostRecentMessage.messageId).toBeDefined();
    expect(match.mostRecentMessage.timestamp).toBeDefined();
    expect(match.mostRecentMessage.sender).toBe('client');
    expect(match.conversationIsRead).toBeFalsy();

    res = await request(app)
      .patch(`/api/conversations/${personSix.id}/messages/${messageId}`)
      .set('Authorization', personFive.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.READ_MESSAGE__SUCCESS.status);

    res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', personFive.token)
      .set('Accept', 'application/json');

    [match] = res.body.data;
    expect(match.mostRecentMessage.content).toBe('hey back');
    expect(match.mostRecentMessage.messageId).toBeDefined();
    expect(match.mostRecentMessage.timestamp).toBeDefined();
    expect(match.mostRecentMessage.sender).toBe('client');
    expect(match.conversationIsRead).toBeTruthy();
  });
});
