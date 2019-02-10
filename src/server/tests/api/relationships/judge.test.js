const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('POST api/relationships/judge', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');

    me = await dbUtils.createUser('mgreen99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/relationships/judge')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/relationships/judge')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should fail if candidateUserId is not a number or not a multiple of 1', async () => {
    let res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: true,
        scene: 'smash',
        liked: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.candidateUserId should be number');

    res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: 9.3,
        scene: 'smash',
        liked: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.candidateUserId should be multiple of 1');
  });

  it('should require "liked" to be a boolean', async () => {
    const res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: 10,
        scene: 'smash',
        liked: 'true',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.liked should be boolean');
  });

  it('should ensure that the scene is valid', async () => {
    let res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: 10,
        scene: 99,
        liked: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.scene should be string');

    res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: 10,
        scene: 'a real string!',
        liked: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.scene should be equal to one of the allowed values');

    res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: 10,
        scene: 'stoner',
        liked: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data.scene should be equal to one of the allowed values');
  });

  it('should not allow a non-existent user to be judged', async () => {
    const res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: -1,
        scene: 'smash',
        liked: true,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.JUDGE__CANDIDATE_NOT_FOUND.status);
  });

  it('should allow a user without a profile setup to be judged', async () => {
    // Create a user with no profile
    const user = await dbUtils.createUser('testu01');
    const res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: user.id,
        scene: 'smash',
        liked: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.JUDGE__SUCCESS.status);
  });

  it('should allow a candidate with a profile to be liked on any scene', async () => {
    const user = await dbUtils.createUser('testu02', true);
    let res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: user.id,
        scene: 'smash',
        liked: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.JUDGE__SUCCESS.status);

    res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: user.id,
        scene: 'social',
        liked: false,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.JUDGE__SUCCESS.status);

    res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: user.id,
        scene: 'stone',
        liked: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.JUDGE__SUCCESS.status);
  });

  it('should allow a user to be disliked after being liked on a scene', async () => {
    const user = await dbUtils.createUser('testu03', true);
    let res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: user.id,
        scene: 'smash',
        liked: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.JUDGE__SUCCESS.status);

    res = await request(app)
      .post('/api/relationships/judge')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({
        candidateUserId: user.id,
        scene: 'smash',
        liked: false,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.JUDGE__SUCCESS.status);
  });
});
