const request = require('supertest');
const _ = require('lodash');
const codes = require('../../../controllers/status-codes');

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

    me = await dbUtils.createUser('mgreen01', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/relationships/matches')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE);
  });

  it('should not return any matches if the user has no relationships', async () => {
    const res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS);
  });

  it('should return a match given a relationship with inverse likes on smash', async () => {
    const other = await dbUtils.createUser('person01', true);
    await dbUtils.createRelationship(me.id, other.id, true);
    await dbUtils.createRelationship(other.id, me.id, true);
    const res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS);
    expect(res.body.matches.length).toBe(1);
    const match = res.body.matches[0];
    expect(match.userId).toBe(other.id);
    expect(match.scenes).toEqual(['smash']);
  });

  it('should return a match given a relationship with inverse likes on smash', async () => {
    const person = await dbUtils.createUser('person02', true);
    await dbUtils.createRelationship(me.id, person.id, true, true, true);
    await dbUtils.createRelationship(person.id, me.id, true, true, true);
    const res = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS);
    expect(res.body.matches.length).toBe(2);
    const personMatch = (res.body.matches[0].id === person.id)
      ? res.body.matches[0]
      : res.body.matches[1];
    expect(personMatch.userId).toBe(person.id);
    expect(personMatch.scenes.sort()).toEqual(['smash', 'stone', 'social'].sort());
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
    expect(res.body.status).toBe(codes.GET_MATCHES__SUCCESS);
    expect(res.body.matches.length).toBe(2); // We should not recieve a result for the blocked one
  });

  // Check that a relationship with likes but also blocks does not get matched
});
