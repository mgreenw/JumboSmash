const request = require('supertest');
const assert = require('assert');
const codes = require('../../../controllers/status-codes');

const app = require('../../../app');

describe('api/auth/register', () => {
  const GOOD_UTLN = 'mloh01';

  it('should require utln field', () => {
    return request(app)
      .post('/api/auth/register')
      .send(
        {
          utlnn: GOOD_UTLN,
          password: 'thisisatest',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.BAD_REQUEST);
        expect(res.body.message).toContain('utln')
      });
  });

  it('should require password field', () => {
    return request(app)
      .post('/api/auth/register')
      .send(
        {
          utln: GOOD_UTLN,
          pasword: 'thisisatest',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.BAD_REQUEST);
        expect(res.body.message).toContain('password')
      });
  });
  it('should succeed with a valid utln and password combo', () => {
    return request(app)
      .post('/api/auth/register')
      .send(
        {
          utln: GOOD_UTLN,
          password: 'anotherONE',
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.REGISTER__NEED_TO_VERIFY);
        expect(res.body.email).toBeDefined();
        expect(res.body.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/)
        expect(res.body.email).not.toContain(GOOD_UTLN)
      });
  });

  it('should fail given a UTLN that does not exist', () => {
    return request(app)
      .post('/api/auth/register')
      .send(
        {
          utln: 'mgreen99',
          password: 'wowthisIsAGR3ATP@SSWORD!',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        assert(res.body.status === codes.REGISTER__UTLN_NOT_FOUND);
      });
  });

  it('should fail given a UTLN that is not valid (not in the class of 2019)', () => {
    return request(app)
      .post('/api/auth/register')
      .send(
        {
          utln: 'dfier01',
          password: 'wowthisIsAGR3ATP@SSWORD!',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        assert(res.body.status === codes.REGISTER__INVALID_UTLN);
      });
  });

  it('should fail given a weak password (less than 8 characters)', () => {
    return request(app)
      .post('/api/auth/register')
      .send(
        {
          utln: GOOD_UTLN,
          password: 'badpwd',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        assert(res.body.status === codes.REGISTER__PASSWORD_WEAK);
      });
  });
});
