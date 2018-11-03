const request = require('supertest');
const codes = require('../../../controllers/status-codes');
const app = require('../../../app');

const db = require('../../../db');

const GOOD_UTLN = 'ecolwe02';
const GOOD_UTLN2 = 'mgreen14';
const BAD_CODE = '123456';
describe('api/auth/verify', () => {
  beforeAll(async () => {
    await db.query('DELETE FROM verification_codes');
    await db.query('DELETE FROM users');
  });

  afterAll(async () => {
    await db.query('DELETE FROM verification_codes');
    await db.query('DELETE FROM users');
  });

  // Normal case: send-verification-email and verify should succeed
  it('basic success: should succeed for 1st verify attempt', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS);
    expect(res.body.email).toContain('Emily.Colwell@tufts.edu');

    const codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN]);
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
          code: codeForGoodUtln.rows[0].code,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res2) => {
        expect(res2.body.status).toBe(codes.VERIFY__SUCCESS);
        expect(res2.body.token).toBeDefined();
      });
  });

  // Tests VERIFY__NO_EMAIL_SENT
  it('no email sent: should fail for good utln without email sent', () => {
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(401)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__NO_EMAIL_SENT);
      });
  });

  // Expect Failure on good login attempt after 3 fails, tests VERIFY__BAD_CODE
  // and VERIFY__EXPIRED_CODE
  it('should fail on verify for good fourth attempt', async () => {
    await db.query(
      'UPDATE verification_codes SET expiration = $1, attempts = $2',
      [new Date(new Date().getTime() + (10 * 60000)), 0],
    );

    const req1 = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);

    expect(req1.body.status).toBe(codes.VERIFY__BAD_CODE);

    const req2 = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);

    expect(req2.body.status).toBe(codes.VERIFY__BAD_CODE);

    const req3 = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);

    expect(req3.body.status).toBe(codes.VERIFY__BAD_CODE);

    const codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN]);
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
          code: codeForGoodUtln.rows[0].code,
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__EXPIRED_CODE);
      });
  });

  // Adds second user to database (its max ;) and expect success on good login
  // after 2 bad logins; tests VERIFY__BAD_CODE and VERIFY__SUCCESS
  it('should succeed on verify for good third attempt', async () => {
    const sendEmailRes = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN2,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(sendEmailRes.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS);
    expect(sendEmailRes.body.email).toContain('Max.Greenwald@tufts.edu');

    const verifyRes1 = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);

    expect(verifyRes1.body.status).toBe(codes.VERIFY__BAD_CODE);

    const verifyRes2 = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);

    expect(verifyRes2.body.status).toBe(codes.VERIFY__BAD_CODE);

    const codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN2]);
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: codeForGoodUtln.rows[0].code,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS);
      });
  });

  // Overkill test: Expects success on good login after failed login
  it('should succeed on verify for good second attempt', async () => {
    await db.query(
      'UPDATE verification_codes SET expiration = $1, attempts = $2',
      [new Date(new Date().getTime() + (10 * 60000)), 0],
    );

    const res1 = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400);

    expect(res1.body.status).toBe(codes.VERIFY__BAD_CODE);

    const codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN2]);
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: codeForGoodUtln.rows[0].code,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS);
        expect(res.body.token).toBeDefined();
      });
  });

  // Max is attempting to log back in; expects success on user exists and
  // already logged in and out
  it('should succeed verifying user after "logging back in"', async () => {
    const res1 = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN2,
          forceResend: true,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(res1.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS);
    expect(res1.body.email).toContain('Max.Greenwald@tufts.edu');

    const codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN2]);
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: codeForGoodUtln.rows[0].code,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS);
        expect(res.body.token).toBeDefined();
      });
  });
});
