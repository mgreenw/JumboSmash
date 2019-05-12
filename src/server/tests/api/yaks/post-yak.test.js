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

async function getYaks(user) {
  const res = await request(app)
    .get('/api/yaks')
    .set('Authorization', user.token)
    .set('Accept', 'application/json');
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
      .post('/api/yaks')
      .set('Accept', 'application/json')
      .send({ content: 'blah' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe01');
    res = await request(app)
      .post('/api/yaks')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .send({ content: 'blah' });
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should require a content field', async () => {
    const res = await request(app)
      .post('/api/yaks')
      .set('Accept', 'application/json')
      .set('Authorization', me.token)
      .send({});
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);
  });

  it('should require the content to have at least one char', async () => {
    const res = await postYak(me, '    ');
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);
  });

  it('should require the content to be less than 300 chars', async () => {
    const res = await postYak(me, 'cQm1KZnfPXbyOwh7nUFpD1RyVpIZlJUsEqn5c9YocYrekUZuHxAqLKhPrRmqV3XjdAyDMh9ktKD7LMij3lwlccCLriF8xB6dzqBETEFmpM14JB49VydcNWMUx2GK8OurL3vbUyD3K1gAfCQ33PIa48rLkYKlzzWOCbXxtxpECGJQuN0NQPS1IDEozQcA3VcbdnKHK3LJJFId9KAgMfEveN8HQr9UxaBK98GpEYHWjfbQo7eNEeJA4pgvUwpG9Lxk2cnX1kmAYaHD0vTOywwke0RUAT7AD2WaBL79iVodmNpSqVifuiX7il');
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.statusCode).toBe(400);
  });

  it('should suceed with a normal length yak', async () => {
    const res = await postYak(me, 'Test Yak 3');
    expect(res.body.status).toBe(codes.POST_YAK__SUCCESS.status);

    // Check yak data
    expect(res.body.data.yak.id).toBeDefined();
    expect(res.body.data.yak.score).toBe(1);
    expect(res.body.data.yak.content).toBe('Test Yak 3');
    expect(res.body.data.yak.timestamp).toBeDefined();
    expect(res.body.data.yak.postedByClient).toBeTruthy();
    expect(res.body.data.yak.clientVote).toBeTruthy();

    // Check yak post availability
    expect(res.body.data.yakPostAvailability.yaksRemaining).toBe(2);
    expect(res.body.data.yakPostAvailability.nextPostTimestamp).toBeDefined();
  });

  it('should not allow more than three yaks in short succession', async () => {
    let res = await postYak(me, 'Test Yak 4');
    expect(res.body.status).toBe(codes.POST_YAK__SUCCESS.status);
    expect(res.body.data.yakPostAvailability.yaksRemaining).toBe(1);

    res = await postYak(me, 'Test Yak 5');
    expect(res.body.status).toBe(codes.POST_YAK__SUCCESS.status);
    expect(res.body.data.yakPostAvailability.yaksRemaining).toBe(0);

    res = await postYak(me, 'Test Yak 6');
    expect(res.body.status).toBe(codes.POST_YAK__TOO_MANY_YAKS.status);
    expect(res.body.data.yakPostAvailability.yaksRemaining).toBe(0);
  });

  it('should get 3 yaks total', async () => {
    const res = await getYaks(other);
    expect(res.body.status).toBe(codes.GET_YAKS__SUCCESS.status);
    expect(res.body.data.yaks.length).toBe(3);
  });
});
