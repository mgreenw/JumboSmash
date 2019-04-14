const request = require('supertest');
const _ = require('lodash');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');
const dbUtils = require('../../utils/db');

const users = {};
const useHe = [];
const useShe = [];
const useThey = [];
const wantHe = [];
const wantShe = [];
const wantThey = [];
const activeSmash = [];
const activeSocial = [];
const activeStone = [];
let me = {};

const meSettings = {
  useHe: true,
  useShe: true,
  useThey: true,
  wantHe: true,
  wantShe: true,
  wantThey: true,
  activeSmash: true,
  activeSocial: true,
  activeStone: true,
};

describe('GET api/relationships/candidates/:scene', () => {
  // Setup
  beforeAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');

    me = await dbUtils.createUser('jjaffe01', true);
    await dbUtils.updateSettings(me.id, meSettings);

    /* eslint-disable no-await-in-loop */
    const createUsers = [...Array(200).keys()].map(async (i) => {
      const user = await dbUtils.createUser(`mgre${i}`, true);
      const settings = {
        useHe: (i % 3) === 0,
        useShe: (i % 2) === 0,
        useThey: (i % 5) === 0,
        wantHe: ((i + 1) % 5) === 0,
        wantShe: ((i + 1) % 3) === 0,
        wantThey: ((i + 1) % 2) === 0,
        activeSmash: ((i + 2) % 2) === 0,
        activeSocial: ((i + 2) % 5) === 0,
        activeStone: ((i + 2) % 3) === 0,
      };
      await dbUtils.updateSettings(user.id, {
        ...settings,
        bio: `is user ${i}`,
      });
      return {
        ...user,
        settings,
      };
    });

    const createdUsers = await Promise.all(createUsers);

    _.map(createdUsers, (user) => {
      users[user.id] = user;
      if (user.settings.useHe) useHe.push(user);
      if (user.settings.useShe) useShe.push(user);
      if (user.settings.useThey) useThey.push(user);
      if (user.settings.wantHe) wantHe.push(user);
      if (user.settings.wantShe) wantShe.push(user);
      if (user.settings.wantThey) wantThey.push(user);
      if (user.settings.activeSmash) activeSmash.push(user);
      if (user.settings.activeSocial) activeSocial.push(user);
      if (user.settings.activeStone) activeStone.push(user);
    });
    /* eslint-enable no-await-in-loop */
  });

  // Teardown
  afterAll(async () => {
    await db.query('DELETE FROM classmates');
    await db.query('DELETE from profiles');
    await db.query('DELETE from relationships');
    await db.query('DELETE FROM classmates');
  });

  it('must require the user to exist and have a profile setup', async () => {
    let res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.BAD_REQUEST.status);
    expect(res.body.message).toBe('Missing Authorization header.');

    const user = await dbUtils.createUser('mgreen01');
    res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe(codes.PROFILE_SETUP_INCOMPLETE.status);
  });

  it('should only allow valid scenes (smash, social, stone)', async () => {
    const user = await dbUtils.createUser('mgreen02');
    await dbUtils.createProfile(user.id, {
      displayName: 'Max',
      bio: 'test',
      birthday: '1997-09-09',
    });
    let res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__SUCCESS.status);

    res = await request(app)
      .get('/api/relationships/candidates/social')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__SUCCESS.status);

    res = await request(app)
      .get('/api/relationships/candidates/stone')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__SUCCESS.status);

    res = await request(app)
      .get('/api/relationships/candidates/smsh')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__INVALID_SCENE.status);

    res = await request(app)
      .get('/api/relationships/candidates/aoei-aoeuu-aoe')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__INVALID_SCENE.status);

    res = await request(app)
      .get('/api/relationships/candidates/stinky')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(codes.GET_SCENE_CANDIDATES__INVALID_SCENE.status);

    res = await request(app)
      .get('/api/relationships/candidates')
      .set('Authorization', user.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(404);
  });

  it('should return with an array of candidates', async () => {
    const res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });

  it('should only return <10 candidates that are active in the scene', async () => {
    // Smash
    let res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(_.every(res.body.data, (candidate) => {
      return users[candidate.userId].settings.activeSmash;
    })).toBeTruthy();
    expect(res.body.data.length).toBeLessThanOrEqual(20);

    // Stone
    res = await request(app)
      .get('/api/relationships/candidates/social')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(_.every(res.body.data, (candidate) => {
      return users[candidate.userId.toString()].settings.activeSocial;
    })).toBeTruthy();
    expect(res.body.data.length).toBeLessThanOrEqual(20);

    // Social
    res = await request(app)
      .get('/api/relationships/candidates/stone')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(_.every(res.body.data, (candidate) => {
      return users[candidate.userId.toString()].settings.activeStone;
    })).toBeTruthy();
    expect(res.body.data.length).toBeLessThanOrEqual(20);
  });

  // Check that only profiles that have not yet been liked show up
  it('should only show profiles that have not yet been liked by the current user', async () => {
    // Create relationhips with me and all but the last 5 in each list
    const relationships = activeSmash.slice(0, -5).map(async (user) => {
      // Create a relationsihp and like them on smash
      await dbUtils.createRelationship(me.id, user.id, true);
    });

    await Promise.all(relationships);

    const res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(_.every(res.body.data, (candidate) => {
      return users[candidate.userId].settings.activeSmash;
    })).toBeTruthy();
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  it('should only show the "correct" profiles for a given scene', async () => {
    const nonLiked = activeSmash.slice(-5);
    const res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(_.every(res.body.data, (candidate) => {
      return _.find(nonLiked, (person) => {
        return person.id === candidate.userId;
      });
    })).toBeTruthy();
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  it('should not return a blocked user', async () => {
    // block a user
    const nonLikedNotBlocked = activeSmash.slice(-5, -1);
    await dbUtils.createRelationship(
      me.id, activeSmash[activeSmash.length - 1].id,
      false,
      false,
      false,
      true,
    );
    const res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(_.every(res.body.data, (candidate) => {
      return _.find(nonLikedNotBlocked, (person) => {
        return person.id === candidate.userId;
      });
    })).toBeTruthy();
    expect(res.body.data.length).toBeLessThanOrEqual(4);
  });

  it('should not return a banned user', async () => {
    const nonLikedNotBlockedNotBanned = activeSmash.slice(-5, -2);
    await dbUtils.banUser(activeSmash[activeSmash.length - 2].id);
    const res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(_.every(res.body.data, (candidate) => {
      return _.find(nonLikedNotBlockedNotBanned, (person) => {
        return person.id === candidate.userId;
      });
    })).toBeTruthy();
    expect(res.body.data.length).toBeLessThanOrEqual(3);
  });

  it('should reset the candidates if the "reset-candidates" query param is supplied', async () => {
    await dbUtils.createRelationship(me.id, activeSmash[activeSmash.length - 3].id, false);

    // Should be 2 before resetting
    let res = await request(app)
      .get('/api/relationships/candidates/smash')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.body.data.length).toBe(2);

    // Should be 3 after resetting
    res = await request(app)
      .get('/api/relationships/candidates/smash?reset-candidates')
      .set('Authorization', me.token)
      .set('Accept', 'application/json');
    expect(res.body.data.length).toBe(3);
  });
});
