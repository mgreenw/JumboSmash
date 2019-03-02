const request = require('supertest');

const codes = require('../../../api/status-codes');
const { profileErrorMessages } = require('../../../api/users/utils');
const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

describe('PATCH api/users/me/profile', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
  });

  it('should fail if the auth token is not a valid JSON WEB token', async () => {
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', 'this-is-not-a-valid-json-web-token')
      .send({})
      .expect(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED.status);
  });

  it('should error if the user does not exist for the given auth token', async () => {
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', (await dbUtils.signToken(1)).token)
      .send({})
      .expect(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED.status);
  });

  it('should fail if the user has been created but does not yet have a profile', async () => {
    const user = await dbUtils.createUser('mgreen13');
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        displayName: 'Max',
        bio: 'He is a guy',
        birthday: '1997-09-09',
      })
      .expect(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should succeed if the user has already created a profile', async () => {
    const user = await dbUtils.createUser('mgreen14');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'He is a guy',
      birthday: '1997-09-09',
    });
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'He is a boy',
        birthday: '1999-09-09',
      })
      .expect(201);
    expect(res.body.status).toBe(codes.UPDATE_PROFILE__SUCCESS.status);
  });

  it('should succeed if no fields are included', async () => {
    const user = await dbUtils.createUser('mgreen18');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'He is a guy',
      birthday: '1997-09-09',
    });
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({})
      .expect(201);
    expect(res.body.status).toBe(codes.UPDATE_PROFILE__SUCCESS.status);
  });

  it('should error if the display name is too long (>50 characters)', async () => {
    const user = await dbUtils.createUser('mgreen19');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'He is a guy',
      birthday: '1997-09-09',
    });
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'he is a man',
        displayName: 'Max is a person who likes going on long hikes and playing with his dog',
        birthday: '1997-09-09',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.UPDATE_PROFILE__INVALID_REQUEST.status);
    expect(res.body.data.message).toBe(profileErrorMessages.DISPLAY_NAME_TOO_LONG);
  });

  it('should error if the bio is too long (>500 characters)', async () => {
    const bioLength = 510;
    let bio = '';
    while (bio.length < bioLength) {
      bio += Math.random().toString(36).substr(2, bioLength - bio.length);
    }
    const user = await dbUtils.createUser('mgreen20');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'He is a guy',
      birthday: '1997-09-09',
    });
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio,
        displayName: 'Max is a person who likes going on long hikes',
        birthday: '1997-09-09',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.UPDATE_PROFILE__INVALID_REQUEST.status);
    expect(res.body.data.message).toBe(profileErrorMessages.BIO_TOO_LONG);
  });

  it('should ensure the date is formatted correctly', async () => {
    const user = await dbUtils.createUser('mgreen21');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'He is a guy',
      birthday: '1997-09-09',
    });
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'Someone likes Star Trek',
        displayName: 'Max is a person who likes going on long hikes',
        birthday: '1997-099-09',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toContain('should match format "date"');
  });

  it('should ensure the birthday is within a reasonable range', async () => {
    const user = await dbUtils.createUser('mgreen22');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'He is a guy',
      birthday: '1997-09-09',
    });
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'Someone likes Star Trek',
        displayName: 'Max is a person who likes going on long hikes',
        birthday: '1980-10-09',
      })
      .expect(400);
    expect(res.body.status).toBe(codes.UPDATE_PROFILE__INVALID_REQUEST.status);
    expect(res.body.data.message).toBe(profileErrorMessages.BIRTHDAY_NOT_VALID);
  });

  it('should allow for all fields to be present and ensure they get stored in the db', async () => {
    const user = await dbUtils.createUser('mgreen25');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'He is a guy',
      birthday: '1997-09-09',
    });
    const birthday = '1997-10-09';
    const res = await request(app)
      .patch('/api/users/me/profile')
      .set('Accept', 'application/json')
      .set('Authorization', user.token)
      .send({
        bio: 'Someone likes Star Trek',
        displayName: 'Max',
        birthday,
      })
      .expect(201);
    expect(res.body.status).toBe(codes.UPDATE_PROFILE__SUCCESS.status);

    const profileResult = await db.query(`
    SELECT *, to_char("birthday", 'YYYY-MM-DD') AS birthday_date
    FROM profiles
    WHERE user_id = $1`, [user.id]);
    expect(profileResult.rowCount).toBe(1);
    const profile = profileResult.rows[0];

    expect(profile.bio).toBe('Someone likes Star Trek');
    expect(profile.display_name).toBe('Max');
    expect(profile.birthday_date).toBe(birthday);
  });
});
