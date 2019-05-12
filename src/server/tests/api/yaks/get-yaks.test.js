const request = require('supertest');
const uuidv4 = require('uuid/v4');

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
  expect(res.body.status).toBe(codes.POST_YAK__SUCCESS.status);
  return res;
}

async function getYaks(user) {
  const res = await request(app)
    .get('/api/yaks')
    .set('Authorization', user.token)
    .set('Accept', 'application/json');
  return res;
}

describe('GET api/yaks', () => {
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
      .get('/api/yaks')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .get('/api/yaks')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should return all yaks', async () => {
    await postYak(other, 'Test Yak 1');
    await postYak(other, 'Test Yak 2');

    const res = await getYaks(me);
    expect(res.body.status).toBe(codes.GET_YAKS__SUCCESS.status);
    expect(res.body.data.yaks.length).toBe(2);
  });

  it('should not return yaks posted over 24 hours ago', async () => {
    await db.query(`
      INSERT INTO yaks
      (user_id, content, score, timestamp)
      VALUES ($1, 'Test', 1, NOW() - INTERVAL '25 hours')
    `, [me.id]);

    const res = await getYaks(me);
    expect(res.body.status).toBe(codes.GET_YAKS__SUCCESS.status);
    expect(res.body.data.yaks.length).toBe(2);
  });

  it('should mark if the client set the yak', async () => {
    await postYak(me, 'Test Yak 3');
    const res = await getYaks(me);
    expect(res.body.status).toBe(codes.GET_YAKS__SUCCESS.status);
    expect(res.body.data.yaks.length).toBe(3);
    expect(res.body.data.yaks[res.body.data.yaks.length - 1].postedByClient).toBeTruthy();
    expect(res.body.data.yaks[res.body.data.yaks.length - 1].clientVote).toBeTruthy();
  });
});
