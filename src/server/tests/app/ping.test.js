const request = require('supertest');

const app = require('../../app');

describe('GET /ping', () => {
  it('should return a 200', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Connection successful. Go 'Bos.");
  });
});
