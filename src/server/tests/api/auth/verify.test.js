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

  // Adding GOOD_UTLN to database (its emily ;))
  it('should return success for send-verification-email to a user', () => {
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
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS);
        expect(res.body.email).toContain('Emily.Colwell@tufts.edu');
      });
  });

  // Normal case: should succeed
  it('basic success: should succeed for 1st attempt good utln and code', async () => {
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
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS);
        expect(res.body.token).toBeDefined();
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
  it('3 bad + 1 good verification attempts: should fail for 1st utln and wrong code', () => {
    db.query(
      'UPDATE verification_codes SET expiration = $1, attempts = $2',
      [new Date(new Date().getTime() + (10 * 60000)), 0]
    )
      .then(() => {
        return request(app)
          .post('/api/auth/verify')
          .send(
            {
              utln: GOOD_UTLN,
              code: BAD_CODE,
            },
          )
          .set('Accept', 'application/json')
          .expect(400)
          .then((res) => {
            expect(res.body.status).toBe(codes.VERIFY__BAD_CODE);
          });
      });
  });

  it('3 bad + 1 good verification attempts: should fail for 2nd utln and wrong code', () => {
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__BAD_CODE);
      });
  });

  it('3 bad + 1 good verification attempts: should fail for 3rd utln and wrong code', () => {
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__BAD_CODE);
      });
  });

  it('3 bad + 1 good verification attempts: should fail for 4th good utln and code', async () => {
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

  // Adds second user to database (its max ;))
  it('should return success for 2nd send-verification-email to a user', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN2,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS);
        expect(res.body.email).toContain('Max.Greenwald@tufts.edu');
      });
  });

  // Expect success on good login after 2 bad logins; tests VERIFY__BAD_CODE and
  // VERIFY__SUCCESS
  it('2 bad + 1 good verification attempts: should fail for 1st utln and wrong code', () => {
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__BAD_CODE);
      });
  });

  it('2 bad + 1 good verification attempts: should fail for 2nd utln and wrong code', () => {
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__BAD_CODE);
      });
  });

  it('2 bad + 1 good verification attempts: should succeed for 3rd utln and good code', async () => {
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
  it('1 bad + 1 good verification attempts: should fail for 1st utln and wrong code', async () => {
    await db.query(
      'UPDATE verification_codes SET expiration = $1, attempts = $2',
      [new Date(new Date().getTime() + (10 * 60000)), 0],
    );
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: BAD_CODE,
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__BAD_CODE);
      });
  });

  it('1 bad + 1 good verification attempts: should succeed for 2nd utln and good code', async () => {
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

  // Max is attempting to log back in
  it('should return success for 2nd send-verification-email to a user', () => {
    return request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          utln: GOOD_UTLN2,
          forceResend: true,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS);
        expect(res.body.email).toContain('Max.Greenwald@tufts.edu');
      });
  });

  // Expects success on user exists and already logged in and out
  it('logged in and out: should succeed for good utln and code', async () => {
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
