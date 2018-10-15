

const request = require('supertest');
const codes = require('../../../controllers/status-codes');

const app = require('../../../app');

describe('api/auth/verify', () => {
  it('should require utln field', () => {
    expect('These test').toBe('written');
  });
});
