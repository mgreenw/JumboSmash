const request = require('supertest');
const codes = require('../../../controllers/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

describe('GET api/users/me/settings', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE from users');
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE from users');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/users/me/settings')
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('mgreen14');
    res = await request(app)
      .get('/api/users/me/profile')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE);
  });

  it('should return the settings of the current user', async () => {
    const user = await dbUtils.createUser('mgreen15');
    const profile = {
      displayName: 'Max',
      birthday: '1999-01-07',
      image1Url: 'https://static1.squarespace.com/static/55ba4b1be4b03f052fff1bf7/t/58c10d86893fc02bf06984b8/1489046924720/tufts-beelzebubs-max-stache.jpg?format=300w',
      image2Url: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiE3JC81L3eAhWld98KHUiBDkAQjRx6BAgBEAU&url=http%3A%2F%2Fwww.bubs.com%2Fmax-greenwald%2F&psig=AOvVaw212VC9a-Z8fNnPPeBc-LBq&ust=1541521276461189',
      bio: 'Hates dogs and realizes that it is not a popular opinion. Sorry Jillian',
    };

    await dbUtils.createProfile(user.id, profile);
    const res = await request(app)
      .get('/api/users/me/settings')
      .set('Authorization', user.token)
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.status).toBe(codes.GET_SETTINGS__SUCCESS);
    expect(res.body.settings).toBeDefined();

    expect(res.body.settings.usesPronouns).toBeDefined();
    expect(res.body.settings.wantsPronouns).toBeDefined();

    expect(res.body.settings.usesPronouns.he).toBeDefined();
    expect(res.body.settings.usesPronouns.she).toBeDefined();
    expect(res.body.settings.usesPronouns.they).toBeDefined();
    expect(res.body.settings.wantsPronouns.he).toBeDefined();
    expect(res.body.settings.wantsPronouns.she).toBeDefined();
    expect(res.body.settings.wantsPronouns.they).toBeDefined();
  });
});
