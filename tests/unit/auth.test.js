const request = require('supertest');
require('dotenv').config();
const PORT = process.env.PORT;
const configAuth = require('../../app/config/auth');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line no-unused-vars
const app = require('../../server');

const BASE_URL = `http://localhost:${PORT}`;

describe('Test Authorize GET /api/token/role/manager', () => {
  let tokenManager;

  beforeAll(() => {
    // user dengan id 1 memiliki positionTitle manager
    tokenManager = jwt.sign({id: 1}, configAuth.secret, {
      algorithm: 'HS256',
      expiresIn: '24h',
    });

    // user dengan id 2 memiliki positionTitle HRD
    tokenNonManager = jwt.sign({id: 2}, configAuth.secret, {
      algorithm: 'HS256',
      expiresIn: '24h',
    });
  });

  it('Should return 200 if users has role manager', async () => {
    const response = await request(BASE_URL).get('/api/token/role/manager')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenManager);

    expect(response.statusCode).toBe(200);
  });

  it('Should return 403 if users not have role manager', async () => {
    const response = await request(BASE_URL).get('/api/token/role/manager')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenNonManager);

    expect(response.statusCode).toBe(403);
  });
});
