import request from 'supertest';
import app from '../app';

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /user-preferences', () => {
    it('should throw an error if no email and telephone', async () => {
      const response = await request(app)
      .post('/user-preferences')
      .send({ preferences: { email: true, sms: true }});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false)
    })

    it('should throw an error if email is invalid', async () => {
      const response = await request(app)
      .post('/user-preferences')
      .send({ email: '', preferences: { email: true, sms: true }});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false)
    })

    it('should throw an error if no preferences', async () => {
      const response = await request(app)
      .post('/user-preferences')
      .send({ email: 'nati@gmail.com', telephone: '+972578268' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false)
    })
  });
});