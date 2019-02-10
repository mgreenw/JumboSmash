const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');

/*
Cases:
1. Should enforce utln field
2. Should fail given an invalid utln
3. Should fail given a UTLN that is not in the class of 2019
4. Should succeed given a valid UTLN
5. Should respond with TOKEN_ALREADY_SENT if the token was already sent
6. Should resend the email if forceResend is true
7. Should not resend the email if forceResend is included but not True
*/

describe('api/auth/send-verification-email', () => {
  const GOOD_UTLN = 'mloh01';
  const PROFESSOR_UTLN = 'skhour01';
  const NON_UNDERGRAD_UTLN = 'aho02';

  afterAll(async () => {
    await db.query('DELETE FROM verification_codes');
    await db.query('DELETE FROM users');
  });

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
        expect(res.body.status).toBe(codes.BAD_REQUEST.status);
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
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_FOUND.status);
      });
  });

  it('should fail given a UTLN that is not in the class of 2019', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: 'dfier01',
        },
      )
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_2019.status);
    expect(res.body.data.classYear).toBe('20');
  });

  it('should fail given a utln that is not a current student', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: PROFESSOR_UTLN,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_STUDENT.status);
  });

  it('should fail given a utln that is a current GRADUATE student in the class of 2019', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: NON_UNDERGRAD_UTLN,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__UTLN_NOT_UNDERGRAD.status);
    expect(res.body.data.college).toBeDefined();
    expect(res.body.data.classYear).toBe('19');
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
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
        expect(res.body.data.email).toBeDefined();
        expect(res.body.data.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/);
        expect(res.body.data.email).not.toContain(GOOD_UTLN);
      });
  });

  it('should respond with EMAIL_ALREADY_SENT if the user tries to resend with no forceResend', () => {
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
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT.status);
        expect(res.body.data.email).toBeDefined();
        expect(res.body.data.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/);
        expect(res.body.data.email).not.toContain(GOOD_UTLN);
      });
  });

  it('should resend a verification email with "forceResend": true', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN,
          forceResend: true,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
        expect(res.body.data.email).toBeDefined();
        expect(res.body.data.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/);
        expect(res.body.data.email).not.toContain(GOOD_UTLN);
      });
  });

  it('should not resend a verification email with "forceResend" not equal to true', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN,
          forceResend: false,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT.status);
      });
  });

  it('should be a BAD_REQUEST when forceResend is not a bool', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN,
          forceResend: 'blahblahblah',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.BAD_REQUEST.status);
      });
  });
});
