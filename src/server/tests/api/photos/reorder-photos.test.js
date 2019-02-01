const request = require('supertest');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

let me = {};

describe('PATCH api/photos/reorder', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from photos');
    await db.query('DELETE from unconfirmed_photos');

    me = await dbUtils.createUser('mgreen99');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from photos');
    await db.query('DELETE from unconfirmed_photos');
  });

  it('must require the user to exist', async () => {
    const res = await request(app)
      .patch('/api/photos/reorder')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should fail given an invalid body', async () => {
    let res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('data should be array');

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([]);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('data should NOT have fewer than 2 items');

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([1, 2, 3, 4, 5]);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('data should NOT have more than 4 items');

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([1, 2, 3, '4']);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('data[3] should be number');

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([1, 2, 3, 4.4]);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('data[3] should be multiple of 1');
  });

  it('should fail if the requested ids do not match the actual photo ids', async () => {
    let res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([1, 2]);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.REORDER_PHOTOS__MISMATCHED_IDS);

    let photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 1, $2)
      RETURNING id
    `, [me.id, uuidv4()]);

    const firstId = photoRes.rows[0].id;

    photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 2, $2)
      RETURNING id
    `, [me.id, uuidv4()]);

    const secondId = photoRes.rows[0].id;

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([firstId, firstId + secondId]);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.REORDER_PHOTOS__MISMATCHED_IDS);

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([firstId, secondId, firstId + secondId]);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.REORDER_PHOTOS__MISMATCHED_IDS);
  });

  it('should succeed given a correct reordering', async () => {
    await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 3, $2),
        ($3, 4, $4)
      RETURNING id
    `, [me.id, uuidv4(), me.id, uuidv4()]);

    let photoRes = await db.query(`
      SELECT id
      FROM photos
      WHERE user_id = $1
      ORDER BY index
    `, [me.id]);

    const newOrder = _.reverse(_.map(photoRes.rows, res => res.id));
    const reorderRes = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send(newOrder);
    expect(reorderRes.statusCode).toBe(200);
    expect(reorderRes.body.status).toBe(codes.REORDER_PHOTOS__SUCCESS);

    photoRes = await db.query(`
      SELECT id
      FROM photos
      WHERE user_id = $1
      ORDER BY index
    `, [me.id]);

    expect(_.isEqual(newOrder, _.map(photoRes.rows, res => res.id))).toBeTruthy();
    expect(_.isEqual(newOrder, reorderRes.body.photos)).toBeTruthy();
  });
});
