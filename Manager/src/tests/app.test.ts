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

  describe('PUT /preferences', () => {
    it('should throw 404 error if no userId as param', async () => {
      const response = await request(app)
      .put('/preferences')
      .send({ preferences: { email: true, sms: true }});

      expect(response.status).toBe(404);
    })

    it('should throw an error if userId does not exists', async () => {
      const response = await request(app)
      .put('/preferences/59')
      .send({ preferences: { email: true, sms: true }});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Could not find a user with id 59');
    })

    it('should throw an error if update data is invalid', async () => {
      const response = await request(app)
      .put('/preferences/59')
      .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    })

    it('should successfully update a user preferences', async () => {
      // Create a new user preference
      const originalPreferences = { email: false, sms: false }
      const userPreferences = { email: 'newuser1@example.com', telephone: '+1234567890', preferences: originalPreferences }
      const { body: { userId } } = await request(app)
        .post('/preferences')
        .send(userPreferences);
      
      // Update this user preference
      const newUpdatedPreferences = {  email: true, sms: true }
      await request(app)
      .put(`/preferences/${userId}`)
      .send({ preferences: newUpdatedPreferences });

      // Get the new updated user
      const { body: { preferences }  } = await request(app)
      .get(`/preferences/${userId}`)
      expect(preferences).toMatchObject(newUpdatedPreferences);
    })
  });
});