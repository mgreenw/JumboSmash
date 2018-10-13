const request = require('supertest');
const assert = require('assert');

const app = require('../../../app');

describe('api/auth/register', () => {
  it('should succeed with a valid utln and password combo', () => {
    request(app)
      .post('/api/auth/register')
      .send(
        {
          utln: 'mgreen14',
          password: 'thisisatest',
        },
      )
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        assert('expiration' in res);
      });
  });
});
