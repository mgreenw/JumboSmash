const request = require('supertest');
const codes = require('../../../controllers/status-codes');
const app = require('../../../app');

const db = require('../../../db');

const GOOD_UTLN = 'ecolwe02';
const GOOD_UTLN2 = 'mgreen14';
const BAD_CODE = '123456';
describe('api/auth/verify', () => {
  afterAll(async () => {
    await db.query('DELETE FROM verification_codes');
    await db.query('DELETE FROM users');
  });

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

  it('3 bad + 1 good verification attempts: should fail for 1st utln and wrong code', async () => {
    db.query(
      'UPDATE verification_codes SET expiration = $1, attempts = $2',
      [new Date(new Date().getTime() + (10 * 60000)), 0],
    );
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
        expect(res.body.status).toBe(codes.VERIFY__EXPIRED_CODE);
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

  it('2 bad + 1 good verification attempts: should fail for 1st utln and wrong code', async () => {
    db.query(
      'UPDATE verification_codes SET expiration = $1, attempts = $2 WHERE utln = $3',
      [new Date(new Date().getTime() + (10 * 60000)), 0, 'mgreen14'],
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

  it('2 bad + 1 good verification attempts: should fail for 3rd utln and good code', async () => {
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
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__EXPIRED_CODE);
      });
  });

  it('2 bad + 1 good verification attempts: should fail for 1st utln and wrong code', async () => {
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

  it('1 bad + 1 good verification attempts: should fail for 1st utln and wrong code', async () => {
    db.query(
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
});
