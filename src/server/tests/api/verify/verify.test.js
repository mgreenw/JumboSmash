const request = require('supertest');
const codes = require('../../../controllers/status-codes');

const app = require('../../../app');

const db = require('../../../db');
const GOOD_UTLN = 'ecolwe02';
const GOOD_UTLN2 = 'mgreen01';
const GOOD_CODE2 = '123456';

describe('api/auth/verify', () => {  

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
	expect(res.body.email).toContain('Emily.Colwell@Tufts.edu');
      });
  });

  it('should succeed for 1st attempt utln and correct code', asynch () => {
    const code_for_good_utln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN],);
  });  

  it('should succeed for 1st attempt utln and correct code', asynch () => {
    const code_for_good_utln = await db.query('SELECT code FROM verification_codes WHERE utln = $1 LIMIT 1', [GOOD_UTLN],);
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
	  code: code_for_good_utln,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS);
	expect(res.body.code).toExist();
      });
  });

  it('should succeed for 2nd attempt utln and correct code', () => {
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
	  code: code_for_good_utln,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS);
	expect(res.body.code).toExist();
      });
  });

  it('should succeed for 3rd attempt utln and correct code', () => {
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
	  code: code_for_good_utln,
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__SUCCESS);
	expect(res.body.code).toExist();
      });
  });

  it('should fail for 4th attempt utln and correct code', () => {
    return request(app)
      .post('/api/auth/verify')
      .send(
        {
          utln: GOOD_UTLN,
	  code: code_for_good_utln,
        },
      )
      .set('Accept', 'application/json')
      .expect(400)
      .then((res) => {
        expect(res.body.status).toBe(codes.VERIFY__EXPIRED_CODE);
      });
  });

  db.query(
    'INSERT INTO users (utln, email) values ($1, $2)', 
    [GOOD_UTLN2, GOOD_CODE2],
  );
});
