import { json } from 'body-parser';
import express, { Request, Response } from 'express';

import { ValidateCreateUserPreferences } from './middlewares/validations';
import { CreateUserPreferencesRequest } from './types';
import { NotificationService } from './services/notification.service';
import { UserPreferencesManager } from './services/preferences.service';

const app = express();
app.use(json());

const notificationService = new NotificationService();
const userPreferencesManager = new UserPreferencesManager(notificationService);

/** Create a new User Preference */
app.post('/preferences', ValidateCreateUserPreferences, async (req: Request, res: Response) => {
    try {
        const userData: CreateUserPreferencesRequest = req.body;
        const newUser = userPreferencesManager.createUser(userData);
        res.status(201).json(newUser);
      } catch (error: any) { // TODO handle errors globally
        res.status(400).json({ success: false, error: error.message });
      }
})

/** Update a user Preference  */
app.put('/preferences', async (req, res) => {
    // Validate no dupes

    // save

    // return
})

/** Send notification base on user preference */
app.post('/send-notifications', async (req, res) => {
    // TODO validate user exists

    // parse input and user preferences

    // if need to send an email -> create a promise

    // if need to send sms -> create a promise

    // await 

    // catch errors

    // return response
})

export default app;