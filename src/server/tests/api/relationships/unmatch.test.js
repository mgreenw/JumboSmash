const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('POST api/relationships/unmatch', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');

    me = await dbUtils.createUser('mgreen99', true);
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/relationships/unmatch')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('jjaffe04');
    res = await request(app)
      .get('/api/relationships/unmatch')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should return not matched given a bad user id', async () => {
    let res = await request(app)
      .post('/api/relationships/unmatch/not-a-user-id')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({});
    expect(res.statusCode).toBe(404);

    const jacob = await dbUtils.createUser('jjaffehehe01', true);

    res = await request(app)
      .post(`/api/relationships/unmatch/${jacob.id}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({});
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.UNMATCH__NOT_MATCHED.status);
  });

  it('should unmatch users that are matched in all scenes', async () => {
    const jacobOne = await dbUtils.createUser('jjaffe01', true);
    const jacobTwo = await dbUtils.createUser('jjaffe02', true);
    await dbUtils.createUser('jjaffe03', true);

    await dbUtils.createRelationship(me.id, jacobOne.id, true);
    await dbUtils.createRelationship(jacobOne.id, me.id, true);

    await dbUtils.createRelationship(me.id, jacobTwo.id, true, false, true);
    await dbUtils.createRelationship(jacobTwo.id, me.id, true, true, false);

    let matches = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(matches.statusCode).toBe(200);
    expect(matches.body.data.length).toBe(2);

    let res = await request(app)
      .post(`/api/relationships/unmatch/${jacobOne.id}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.UNMATCH__SUCCESS.status);

    matches = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(matches.statusCode).toBe(200);
    expect(matches.body.data.length).toBe(1);

    res = await request(app)
      .post(`/api/relationships/unmatch/${jacobTwo.id}`)
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.UNMATCH__SUCCESS.status);

    matches = await request(app)
      .get('/api/relationships/matches')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(matches.statusCode).toBe(200);
    expect(matches.body.data.length).toBe(0);

    const jacobOneRelationship = await db.query(`
      SELECT liked_smash, liked_social, liked_stone
      FROM relationships
      WHERE critic_user_id = $1 AND candidate_user_id = $2
        OR critic_user_id = $2 AND candidate_user_id = $1
    `, [me.id, jacobOne.id]);

    expect(jacobOneRelationship.rows[0].liked_smash).toBeFalsy();
    expect(jacobOneRelationship.rows[0].liked_social).toBeFalsy();
    expect(jacobOneRelationship.rows[0].liked_stone).toBeFalsy();
    expect(jacobOneRelationship.rows[1].liked_smash).toBeFalsy();
    expect(jacobOneRelationship.rows[1].liked_social).toBeFalsy();
    expect(jacobOneRelationship.rows[1].liked_stone).toBeFalsy();
  });
});
