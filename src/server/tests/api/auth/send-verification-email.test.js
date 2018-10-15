const request = require('supertest');
const codes = require('../../../controllers/status-codes');

const app = require('../../../app');

describe('api/auth/send-verification-email', () => {
  const GOOD_UTLN = 'mloh01';

  it('should require utln field', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          poorly_spelled_utln: GOOD_UTLN,
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.BAD_REQUEST);
        expect(res.body.message).toContain('utln');
      });
  });

  it('should fail given a UTLN that does not exist', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: 'mgrizz99',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND);
      });
  });

  it('should fail given a UTLN that is not valid (not in the class of 2019)', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: 'dfier01',
          password: 'wowthisIsAGR3ATP@SSWORD!',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_2019);
      });
  });

  it('should succeed in sending an email with a valid utln', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_SENT);
        expect(res.body.email).toBeDefined();
        expect(res.body.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/);
        expect(res.body.email).not.toContain(GOOD_UTLN);
      });
  });

  it('should resend a verification email on 2nd request', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_SENT);
        expect(res.body.email).toBeDefined();
        expect(res.body.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/);
        expect(res.body.email).not.toContain(GOOD_UTLN);
      });
  });

  it('should resend a verification email on 3rd request', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_SENT);
        expect(res.body.email).toBeDefined();
        expect(res.body.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/);
        expect(res.body.email).not.toContain(GOOD_UTLN);
      });
  });

  it('should FAIL to resend a verification email on the 4th rapid request', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN,
        },
      )
      .set('Accept', 'application/json')
      .expect(429)
      .then((res) => {
        expect(res.body.status).toBe(codes.TOO_MANY_REQUESTS);
      });
  });
});
