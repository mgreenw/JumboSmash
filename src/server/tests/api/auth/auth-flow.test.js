const request = require('supertest');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const codes = require('../../../api/status-codes');
const app = require('../../../app');

const db = require('../../../db');

const dbUtils = require('../../utils/db');

const GOOD_EMAIL = 'jchun03@tufts.edu';
const GOOD_UTLN = 'jchun03';
const GOOD_EMAIL2 = 'Ronald.Zampolin@tufts.edu';
const GOOD_UTLN2 = 'rzampo01';
const BAD_CODE = '123456';
describe('api/auth/verify', () => {
  beforeAll(async () => {
    await db.query('DELETE FROM verification_codes');
    await db.query('DELETE FROM classmates');
    await db.query('DELETE FROM admins');

    await db.query(`
      INSERT INTO admins
      (utln)
      VALUES ('mgreen14'), ('jjaffe01')
    `);

    await db.query(`
      INSERT INTO testers
      (utln)
      VALUES ('jchun03'), ('rzampo01'), ('mgreen14'), ('jjaffe01')
    `);
  });

  afterAll(async () => {
    await db.query('DELETE FROM verification_codes');
    await db.query('DELETE FROM admins');
    await db.query('DELETE FROM classmates');
    await db.query('DELETE FROM testers');
  });

  // Normal case: send-verification-email and verify should succeed
  it('basic success: should succeed for 1st verify attempt', async () => {
    let res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
    expect(res.body.data.email).toContain('Jasmin.Chun@tufts.edu');
    const { utln } = res.body.data;

    const codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [utln]);
    res = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln,
          code: codeForGoodUtln.rows[0].code,
        },
      )
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual(codes.VERIFY__SUCCESS.status);
    expect(res.body.data.token).toBeDefined();

    const result = await db.query('SELECT is_admin AS "isAdmin" FROM users WHERE utln = $1', [utln]);
    expect(result.rows[0].isAdmin).toBeFalsy();
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
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__NO_EMAIL_SENT.status);
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

    expect(req1.body.status).toEqual(codes.VERIFY__BAD_CODE.status);

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

    expect(req2.body.status).toEqual(codes.VERIFY__BAD_CODE.status);

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

    expect(req3.body.status).toEqual(codes.VERIFY__BAD_CODE.status);

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
        expect(res.body.status).toBe(codes.VERIFY__EXPIRED_CODE.status);
      });
  });

  // Adds second user to database (its max ;) and expect success on good login
  // after 2 bad logins; tests VERIFY__BAD_CODE and VERIFY__SUCCESS
  it('should succeed on verify for good third attempt', async () => {
    const sendEmailRes = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL2,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(sendEmailRes.body.status).toEqual(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
    expect(sendEmailRes.body.data.email).toContain('Ronald.Zampolin@tufts.edu');

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

    expect(verifyRes1.body.status).toEqual(codes.VERIFY__BAD_CODE.status);

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

    expect(verifyRes2.body.status).toEqual(codes.VERIFY__BAD_CODE.status);

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
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS.status);
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

    expect(res1.body.status).toEqual(codes.VERIFY__BAD_CODE.status);

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
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS.status);
        expect(res.body.data.token).toBeDefined();
      });
  });

  // Max is attempting to log back in; expects success on user exists and
  // already logged in and out
  it('should succeed verifying user after "logging back in"', async () => {
    const res1 = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL2,
          forceResend: true,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(res1.body.status).toEqual(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
    expect(res1.body.data.email).toContain('Ronald.Zampolin@tufts.edu');

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
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS.status);
        expect(res.body.data.token).toBeDefined();
      });
  });

  it('should invalidate the users first token if the user logs in AGAIN', async () => {
    let res1 = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL2,
          forceResend: true,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(res1.body.status).toEqual(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
    expect(res1.body.data.email).toContain('Ronald.Zampolin@tufts.edu');

    let codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN2]);
    let res = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: codeForGoodUtln.rows[0].code,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);


    const firstToken = res.body.data.token;

    expect(res.body.status).toBe(codes.VERIFY__SUCCESS.status);
    expect(res.body.data.token).toBeDefined();

    // Log in again
    res1 = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL2,
          forceResend: true,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(res1.body.status).toEqual(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
    expect(res1.body.data.email).toContain('Ronald.Zampolin@tufts.edu');

    codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN2]);
    res = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: codeForGoodUtln.rows[0].code,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.status).toBe(codes.VERIFY__SUCCESS.status);
    expect(res.body.data.token).toBeDefined();

    // Ensure that the first token is invalidated
    res = await request(app)
      .get('/api/auth/get-token-utln')
      .set('Authorization', firstToken)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(codes.UNAUTHORIZED.status);
  });

  it('should set the is_admin flag for users in the admin table', async () => {
    let res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: 'mgreen14@tufts.edu',
        },
      )
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
    expect(res.body.data.email).toContain('Max.Greenwald@tufts.edu');
    const { utln } = res.body.data;

    const codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [utln]);
    res = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln,
          code: codeForGoodUtln.rows[0].code,
        },
      )
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual(codes.VERIFY__SUCCESS.status);
    expect(res.body.data.token).toBeDefined();


    const result = await db.query('SELECT is_admin AS "isAdmin" FROM users WHERE utln = $1', [utln]);
    expect(result.rows[0].isAdmin).toBeTruthy();
  });

  it('should allow the tester@jumbosmash.com user to login with verification code 654321', async () => {
    let res = await request(app)
      .post('/api/auth/send-verification-email')
      .set('Accept', 'application/json')
      .send(
        {
          email: 'tester@jumbosmash.com',
        },
      );
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
    expect(res.body.data.email).toBe('tester@jumbosmash.com');
    expect(res.body.data.utln).toBe('tester');

    res = await request(app)
      .post('/api/auth/verify')
      .set('Accept', 'application/json')
      .send(
        {
          utln: 'tester',
          code: '654321',
        },
      );

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(codes.VERIFY__SUCCESS.status);
    expect(res.body.data.token).toBeDefined();
  });

  it('should add the expo push token, if possible', async () => {
    let res = await request(app)
      .post('/api/auth/send-verification-email')
      .send(
        {
          email: GOOD_EMAIL2,
          forceResend: true,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.status).toEqual(codes.SEND_VERIFICATION_EMAIL__SUCCESS.status);
    expect(res.body.data.email).toContain('Ronald.Zampolin@tufts.edu');

    const codeForGoodUtln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN2]);
    const token = uuidv4();
    res = await request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN2,
          code: codeForGoodUtln.rows[0].code,
          expoPushToken: token,
        },
      )
      .set('Accept', 'application/json')
      .expect(200);

    const tokenRes = await db.query('SELECT expo_push_token FROM classmates WHERE utln = $1 LIMIT 1', [GOOD_UTLN2]);
    expect(tokenRes.rows[0].expo_push_token).toBe(token);
  });

  it('should return UNAUTHENTICATED if the token is generated with a bad secret', async () => {
    const me = await dbUtils.createUser('mgreen99', true);
    const token = jwt.sign({
      userId: me.id,
      uuid: me.tokenUUID,
    }, 'NOT_THE_REAL_SECRET', {
      expiresIn: 31540000, // expires in 365 days
    });
    const res = await request(app)
      .get('/api/users/me/settings')
      .set('Authorization', token)
      .send(
        {
          email: GOOD_EMAIL2,
        },
      )
      .set('Accept', 'application/json');

    expect(res.body.status).toBe(codes.UNAUTHORIZED.status);
    expect(res.statusCode).toBe(401);
  });
});
