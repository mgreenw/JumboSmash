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
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE from photos');
    await db.query('DELETE from unconfirmed_photos');

    me = await dbUtils.createUser('mgreen99');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
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
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');
  });

  it('should fail given an invalid body', async () => {
    let res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data should be array');

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([]);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data should NOT have fewer than 2 items');

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([
        'c7ffd202-1ca6-401d-9a4d-d5f541fdfbd2',
        '9c52da65-db3b-453f-8d76-71ce2f5a4ead',
        '1210da25-347c-4d59-957d-8aef471e9673',
        'dcdc3010-6bcb-4ab6-b291-3d3bd9fb046e',
        'e257fe73-1a5f-4df6-ada0-2dbdd10537ac',
      ]);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data should NOT have more than 4 items');

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([
        '45df643d-b07c-4ccc-8559-36b8e2b2fde7',
        '9bcdca6a-04a9-4cab-bb39-62639ec8a263',
        '365a2dce-0d72-4787-bd60-06d2455fdb02',
        1,
      ]);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('data[3] should be string');
  });

  it('should fail if the requested ids do not match the actual photo ids', async () => {
    let res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send(['02420546-e6a1-46d7-b2af-7b7aad09e1a8', 'c77a9743-7f91-44c4-9704-5bc2a482e193']);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.REORDER_PHOTOS__MISMATCHED_UUIDS.status);

    let photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 1, $2)
      RETURNING uuid
    `, [me.id, uuidv4()]);

    const firstUuid = photoRes.rows[0].uuid;

    photoRes = await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 2, $2)
      RETURNING uuid
    `, [me.id, uuidv4()]);

    const secondUuid = photoRes.rows[0].uuid;

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([firstUuid, 'b313259c-379c-4812-9af3-16a4b91c48a6']);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.REORDER_PHOTOS__MISMATCHED_UUIDS.status);

    res = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send([firstUuid, secondUuid, 'c70a2307-fae8-49bc-9587-88048202e8d9']);
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.REORDER_PHOTOS__MISMATCHED_UUIDS.status);
  });

  it('should succeed given a correct reordering', async () => {
    await db.query(`
      INSERT INTO photos (user_id, index, uuid)
      VALUES
        ($1, 3, $2),
        ($3, 4, $4)
      RETURNING uuid
    `, [me.id, uuidv4(), me.id, uuidv4()]);

    let photoRes = await db.query(`
      SELECT uuid
      FROM photos
      WHERE user_id = $1
      ORDER BY index
    `, [me.id]);

    const newOrder = _.reverse(_.map(photoRes.rows, res => res.uuid));
    const reorderRes = await request(app)
      .patch('/api/photos/reorder')
      .set('Authorization', me.token)
      .set('Accept', 'application/json')
      .send(newOrder);
    expect(reorderRes.statusCode).toBe(200);
    expect(reorderRes.body.status).toEqual(codes.REORDER_PHOTOS__SUCCESS.status);

    photoRes = await db.query(`
      SELECT uuid
      FROM photos
      WHERE user_id = $1
      ORDER BY index
    `, [me.id]);

    expect(_.isEqual(newOrder, _.map(photoRes.rows, res => res.uuid))).toBeTruthy();
    expect(_.isEqual(newOrder, reorderRes.body.data)).toBeTruthy();
  });
});
