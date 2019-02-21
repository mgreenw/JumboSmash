const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me;

describe('GET api/relationships/matches', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from messages');

    me = await dbUtils.createUser('mgreen01', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
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
    await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: other.id,
        scene: 'smash',
        liked: true,
      });
    await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', other.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: me.id,
        scene: 'smash',
        liked: true,
      });

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

  it('should return a match given a relationship with inverse likes on smash', async () => {
    const person = await dbUtils.createUser('person02', true);
    await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: person.id,
        scene: 'smash',
        liked: true,
      });
    await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', person.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: me.id,
        scene: 'smash',
        liked: true,
      });

    await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: person.id,
        scene: 'social',
        liked: true,
      });
    await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', person.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: me.id,
        scene: 'social',
        liked: true,
      });

    await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: person.id,
        scene: 'stone',
        liked: true,
      });
    await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', person.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: me.id,
        scene: 'stone',
        liked: true,
      });
    const res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS.status);
    expect(res.body.data.length).toBe(2);

    // NOTE: this tests ordering by 'last match date' if messages are null
    const personMatch = (res.body.data[0].id === person.id)
      ? res.body.data[1]
      : res.body.data[0];
    expect(personMatch.userId).toBe(person.id);
    expect(personMatch.scenes.smash).not.toBeNull();
    expect(personMatch.scenes.social).not.toBeNull();
    expect(personMatch.scenes.stone).not.toBeNull();
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
    expect(res.body.data.length).toBe(2);
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
    expect(res.body.data.length).toBe(2);
  });

  it('should return the most recent message between the users', async () => {
    let res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    const matchIds = res.body.data.map((match) => {
      expect(match.mostRecentMessage).toBeNull();
      return match.userId;
    });


    res = await request(app)
      .post(`/api/messages/${matchIds[0]}`)
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ content: 'hey' });

    res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    // User should be at the end of the list now
    const message = res.body.data[res.body.data.length - 1].mostRecentMessage;
    expect(message.content).toBe('hey');
    expect(message.messageId).toBeDefined();
    expect(message.timestamp).toBeDefined();
    expect(message.fromClient).toBeTruthy();

    expect(res.body.data[0].mostRecentMessage).toBeNull();
  });
});
