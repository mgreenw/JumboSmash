const request = require('supertest');
const codes = require('../../../controllers/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');
const { profileErrorMessages } = require('../../../controllers/users/utils');

describe('POST api/users/me/profile', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
  });

  it('should fail if the auth token is not a valid JSON WEB token', async () => {
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', 'this-is-not-a-valid-json-web-token')
      .send({})
      .expect(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED);
  });

  it('should error if the user does not exist for the given auth token', async () => {
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', await dbUtils.signToken(1))
      .send({})
      .expect(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED);
  });

  it('should succeed if the user has been created and does not yet have a profile', async () => {
    const user = await dbUtils.createUser('mgreen13');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        displayName: 'Max',
        bio: 'He is a guy',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
        birthday: '1997-09-09',
      })
      .expect(201);
    expect(res.body.status).toBe(codes.CREATE_PROFILE__SUCCESS);
  });

  it('should fail if the user has already created a profile', async () => {
    const user = await dbUtils.createUser('mgreen14');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'He is a guy',
      image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      birthday: '1997-09-09',
    });
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        displayName: 'Max',
        bio: 'He is a guy',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
        birthday: '1997-09-09',
      })
      .expect(409);
    expect(res.body.status).toBe(codes.CREATE_PROFILE__PROFILE_ALREADY_CREATED);
  });

  it('should return bad request if displayName is not included', async () => {
    const user = await dbUtils.createUser('mgreen15');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'He is a guy',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
        birthday: '1997-09-09',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toContain('displayName');
  });

  it('should return bad request if birthday is not included', async () => {
    const user = await dbUtils.createUser('mgreen16');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        displayName: 'Max',
        bio: 'He is a guy',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toContain('birthday');
  });

  it('should return bad request if image1Url is not included', async () => {
    const user = await dbUtils.createUser('mgreen17');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        displayName: 'Max',
        bio: 'He is a guy',
        birthday: '1997-09-09',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toContain('image1Url');
  });

  it('should return bad request if bio is not included', async () => {
    const user = await dbUtils.createUser('mgreen18');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        displayName: 'Max',
        birthday: '1997-09-09',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toContain('bio');
  });

  it('should error if the display name is too long (>50 characters)', async () => {
    const user = await dbUtils.createUser('mgreen19');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'he is a man',
        displayName: 'Max is a person who likes going on long hikes and playing with his dog',
        birthday: '1997-09-09',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.CREATE_PROFILE__INVALID_REQUEST);
    expect(res.body.message).toBe(profileErrorMessages.DISPLAY_NAME_TOO_LONG);
  });

  it('should error if the bio is too long (>500 characters)', async () => {
    const bioLength = 510;
    let bio = '';
    while (bio.length < bioLength) {
      bio += Math.random().toString(36).substr(2, bioLength - bio.length);
    }
    const user = await dbUtils.createUser('mgreen20');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio,
        displayName: 'Max is a person who likes going on long hikes',
        birthday: '1997-09-09',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.CREATE_PROFILE__INVALID_REQUEST);
    expect(res.body.message).toBe(profileErrorMessages.BIO_TOO_LONG);
  });

  it('should ensure the date is formatted correctly', async () => {
    const user = await dbUtils.createUser('mgreen21');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'Someone likes Star Trek',
        displayName: 'Max is a person who likes going on long hikes',
        birthday: '1997-099-09',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toContain('should match format "date"');
  });

  it('should ensure the birthday is within a reasonable range', async () => {
    const user = await dbUtils.createUser('mgreen22');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'Someone likes Star Trek',
        displayName: 'Max is a person who likes going on long hikes',
        birthday: '1980-10-09',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.CREATE_PROFILE__INVALID_REQUEST);
    expect(res.body.message).toBe(profileErrorMessages.BIRTHDAY_NOT_VALID);
  });

  it('should ensure the the image urls use HTTPS', async () => {
    const user = await dbUtils.createUser('mgreen23');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'Someone likes Star Trek',
        displayName: 'Max is a person who likes going on long hikes',
        birthday: '1997-10-09',
        // doen't use HTTPS
        image1Url: 'http://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.CREATE_PROFILE__INVALID_REQUEST);
    expect(res.body.message).toBe(profileErrorMessages.IMAGE_URL_NOT_VALID);
  });

  it('should ensure the the image urls are valid URLs', async () => {
    const user = await dbUtils.createUser('mgreen24');
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'Someone likes Star Trek',
        displayName: 'Max is a person who likes going on long hikes',
        birthday: '1997-10-09',
        image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
        image2Url: 'https:static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.CREATE_PROFILE__INVALID_REQUEST);
    expect(res.body.message).toBe(profileErrorMessages.IMAGE_URL_NOT_VALID);
  });

  it('should allow for all fields to be present and ensure they get stored in the db', async () => {
    const user = await dbUtils.createUser('mgreen25');
    const birthday = '1997-10-09';
    const url = 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/5a0a3ba04192029150cb2aeb/1510620084146/bubs-max.jpg?format=1000w';
    const res = await request(app)
      .post('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'Someone likes Star Trek',
        displayName: 'Max',
        birthday,
        image1Url: url,
        image2Url: url,
        image3Url: url,
        image4Url: url,
      })
      .expect(201);
    expect(res.body.status).toBe(codes.CREATE_PROFILE__SUCCESS);

    const profileResult = await db.query(`
    SELECT *, to_char("birthday", 'YYYY-MM-DD') AS birthday_date
    FROM profiles
    WHERE user_id = $1`, [user.id]);
    expect(profileResult.rowCount).toBe(1);
    const profile = profileResult.rows[0];

    expect(profile.bio).toBe('Someone likes Star Trek');
    expect(profile.display_name).toBe('Max');
    expect(profile.birthday_date).toBe(birthday);
    expect(profile.image1_url).toBe(url);
    expect(profile.image2_url).toBe(url);
    expect(profile.image3_url).toBe(url);
    expect(profile.image4_url).toBe(url);
  });
});
