import request from 'supertest';
import app from '../app';

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /preferences', () => {
    it('should throw an error if no email or telephone', async () => {
      const response = await request(app)
      .post('/preferences')
      .send({ preferences: { email: true, sms: true }});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false)
    })

    it('should throw an error if email is invalid', async () => {
      const response = await request(app)
      .post('/preferences')
      .send({ email: '', preferences: { email: true, sms: true }});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false)
    })

    it('should throw an error if no preferences', async () => {
      const response = await request(app)
      .post('/preferences')
      .send({ email: 'nati@gmail.com', telephone: '+972578268' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false)
    })

    it('should successfully create a new user preference', async () => {
      const userPreferences = { email: 'newuser@example.com', telephone: '+1234567890', preferences: { email: true, sms: true }}
      const response = await request(app)
        .post('/preferences')
        .send(userPreferences);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(userPreferences);
      expect(response.body.userId).toBeDefined();
    })

    it('should throw an error for duplicate email', async () => {
      const userPreferences = { email: 'newuser@example.com', telephone: '+1234567890', preferences: { email: true, sms: true }}
      const response = await request(app)
        .post('/preferences')
        .send(userPreferences);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User with this email already exists');
    })
  });
});