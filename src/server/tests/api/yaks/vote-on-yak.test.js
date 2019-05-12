const request = require('supertest');

const codes = require('../../../api/status-codes');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};
let other = {};

async function postYak(user, content) {
  const res = await request(app)
    .post('/api/yaks')
    .set('Accept', 'application/json')
    .set('Authorization', user.token)
    .send({ content });
  return res;
}

async function voteOnYak(user, yakId, vote) {
  const res = await request(app)
    .patch(`/api/yaks/${yakId}`)
    .set('Authorization', user.token)
    .set('Accept', 'application/json')
    .send({ liked: vote });
  return res;
}

describe('POST api/yaks', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM yaks');
    await db.query('DELETE FROM yak_votes');
    await db.query('DELETE from classmates');

    me = await dbUtils.createUser('mgreen99', true);
    other = await dbUtils.createUser('jjaffe99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM yaks');
    await db.query('DELETE FROM yak_votes');
    await db.query('DELETE FROM classmates');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .patch('/api/yaks/1')
      .set('Accept', 'application/json')
      .send({ content: 'blah' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .patch('/api/yaks/1')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .send({ content: 'blah' });
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should require a boolean liked field', async () => {
    let res = await request(app)
      .patch('/api/yaks/1')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({});
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);

    res = await request(app)
      .patch('/api/yaks/1')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({ liked: 'true' });
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);
  });

  it('should fail if the yak does not exist', async () => {
    const res = await voteOnYak(me, 0, true);
    expect(res.body.status).toBe(codes.VOTE_ON_YAK__YAK_NOT_FOUND.status);
  });

  it('should succeed if the yak exists', async () => {
    let res = await postYak(me, 'Test Yak 4');
    expect(res.body.status).toBe(codes.POST_YAK__SUCCESS.status);
    res = await voteOnYak(other, res.body.data.yak.id, true);
    expect(res.body.status).toBe(codes.VOTE_ON_YAK__SUCCESS.status);

    expect(res.body.data.yak.id).toBeDefined();
    expect(res.body.data.yak.score).toBe(2);
    expect(res.body.data.yak.content).toBe('Test Yak 4');
    expect(res.body.data.yak.timestamp).toBeDefined();
    expect(res.body.data.yak.postedByClient).toBeFalsy();
    expect(res.body.data.yak.clientVote).toBeTruthy();

    res = await voteOnYak(other, res.body.data.yak.id, false);
    expect(res.body.status).toBe(codes.VOTE_ON_YAK__SUCCESS.status);

    expect(res.body.data.yak.id).toBeDefined();
    expect(res.body.data.yak.score).toBe(0);
    expect(res.body.data.yak.content).toBe('Test Yak 4');
    expect(res.body.data.yak.timestamp).toBeDefined();
    expect(res.body.data.yak.postedByClient).toBeFalsy();
    expect(res.body.data.yak.clientVote).toBeFalsy();
  });

  it('should allow voting on your own yak', async () => {
    let res = await postYak(me, 'Test Yak 5');
    expect(res.body.status).toBe(codes.POST_YAK__SUCCESS.status);
    res = await voteOnYak(me, res.body.data.yak.id, true);
    expect(res.body.status).toBe(codes.VOTE_ON_YAK__SUCCESS.status);

    expect(res.body.data.yak.id).toBeDefined();
    expect(res.body.data.yak.score).toBe(1);
    expect(res.body.data.yak.content).toBe('Test Yak 5');
    expect(res.body.data.yak.timestamp).toBeDefined();
    expect(res.body.data.yak.postedByClient).toBeTruthy();
    expect(res.body.data.yak.clientVote).toBeTruthy();

    res = await voteOnYak(me, res.body.data.yak.id, false);
    expect(res.body.status).toBe(codes.VOTE_ON_YAK__SUCCESS.status);

    expect(res.body.data.yak.id).toBeDefined();
    expect(res.body.data.yak.score).toBe(-1);
    expect(res.body.data.yak.content).toBe('Test Yak 5');
    expect(res.body.data.yak.timestamp).toBeDefined();
    expect(res.body.data.yak.postedByClient).toBeTruthy();
    expect(res.body.data.yak.clientVote).toBeFalsy();
  });
});
