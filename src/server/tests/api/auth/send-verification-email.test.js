const request = require('supertest');
const codes = require('../../../api/status-codes');

const app = require('../../../app');
const db = require('../../../db');

/*
Cases:
1. Should enforce utln field
2. Should fail given an invalid utln
3. Should fail given a EMAIL that is not in the class of 2019
4. Should succeed given a valid EMAIL
5. Should respond with TOKEN_ALREADY_SENT if the token was already sent
6. Should resend the email if forceResend is true
7. Should not resend the email if forceResend is included but not True
*/

describe('api/auth/send-verification-email', () => {
  const GOOD_EMAIL = 'jacob.Jaffe@tufts.edu';
  const PROFESSOR_EMAIL = 'Stephanie.khoury@tufts.edu';
  const NON_UNDERGRAD_EMAIL = 'aho02@tufts.edu';

  beforeAll(async () => {
    // BETA-only: assume these users are beta testerts
    await db.query(`
      INSERT INTO testers
      (utln)
      VALUES ('jjaffe01'), ('skhour01'), ('aho02'), ('dfier01')
    `);
  });

  afterAll(async () => {
    await db.query('DELETE FROM verification_codes');
    await db.query('DELETE FROM classmates');
    await db.query('DELETE FROM testers');
  });

  it('should require email field', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          poorly_spelled_email: GOOD_EMAIL,
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.BAD_REQUEST.status);
        expect(res.body.message).toContain('email');
      });
  });

  it('should fail if the email is not a valid email', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: 'mgrizz99',
        },
      )
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('data.email should match format "email"');
  });

  it('should fail given a EMAIL that does not exist', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: 'mgrizz99@tufts.edu',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_FOUND.status);
      });
  });

  it('should fail given an email that is not in the class of 2019', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: 'dfier01@tufts.edu',
        },
      )
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_2019.status);
    expect(res.body.data.classYear).toBe('20');
  });

  it('should fail given a email that is not a current student', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: PROFESSOR_EMAIL,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_STUDENT.status);
  });

  it('should fail given an email that is a current GRADUATE student in the class of 2019', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: NON_UNDERGRAD_EMAIL,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);
    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_NOT_UNDERGRAD.status);
    expect(res.body.data.college).toBeDefined();
    expect(res.body.data.classYear).toBe('19');
  });

  it('should succeed in sending an email with a valid email', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
        expect(res.body.data.email).toBeDefined();
        expect(res.body.data.utln).toBeDefined();
        expect(res.body.data.utln).toBe('jjaffe01');
        expect(res.body.data.email).toBeDefined();
        expect(res.body.data.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/);
        expect(res.body.data.email).not.toContain(GOOD_EMAIL);
      });
  });

  it('should respond with EMAIL_ALREADY_SENT if the user tries to resend with no forceResend', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT.status);
        expect(res.body.data.email).toBeDefined();
        expect(res.body.data.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/);
        expect(res.body.data.email).not.toContain(GOOD_EMAIL);
        expect(res.body.data.utln).toBeDefined();
        expect(res.body.data.utln).toBe('jjaffe01');
      });
  });

  it('should resend a verification email with "forceResend": true', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL,
          forceResend: true,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
        expect(res.body.data.email).toBeDefined();
        expect(res.body.data.email).toMatch(/^[A-Za-z0-9._%+-]+@tufts.edu/);
        expect(res.body.data.email).not.toContain(GOOD_EMAIL);
        expect(res.body.data.utln).toBe('jjaffe01');
      });
  });

  it('should not resend a verification email with "forceResend" not equal to true', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL,
          forceResend: false,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__EMAIL_ALREADY_SENT.status);
        expect(res.body.data.utln).toBeDefined();
        expect(res.body.data.utln).toBe('jjaffe01');
      });
  });

  it('should be a BAD_REQUEST when forceResend is not a bool', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL,
          forceResend: 'blahblahblah',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.BAD_REQUEST.status);
      });
  });

  it('should be a be a not-tufts email if it is a gmail acct', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: 'mgreen14@gmail.com',
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__NOT_TUFTS_EMAIL.status);
      });
  });
});
