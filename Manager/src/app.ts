import { json } from 'body-parser';
import express, { Request, Response } from 'express';

import { NotificationService } from './services/notification.service';
import { UserPreferencesManager } from './services/preferences.service';
import { CreateUserPreferencesRequest, UpdateUserPreferencesRequest } from './types';
import { ValidateUpdatePreferences } from './middlewares/update-preferences.middleware';
import { ValidateCreateUserPreferences } from './middlewares/create-preferences.middelware';

const app = express();
app.use(json());

const notificationService = new NotificationService();
const userPreferencesManager = new UserPreferencesManager(notificationService);

/** Create a new User Preference */
app.post('/preferences', ValidateCreateUserPreferences, async (req: Request, res: Response) => {
    try {
        const preferencesData: CreateUserPreferencesRequest = req.body; // TODO better types
        const newPreferencesData = userPreferencesManager.createUser(preferencesData);
        res.status(201).json(newPreferencesData);
      } catch (error: any) { // TODO handle errors globally
        res.status(400).json({ success: false, error: error.message });
      }
})

/** Update a user Preference  */
app.put('/preferences/:id', ValidateUpdatePreferences, async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const updateData: UpdateUserPreferencesRequest = req.body;
        const updatedPreferences = userPreferencesManager.updatePreferences(userId, updateData);
        res.json(updatedPreferences);
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
})

app.get('/preferences/:id', async (req: Request, res: Response)  => {
    const userId = Number(req.params.id);
    console.log(userId)
    res.json(userPreferencesManager.getByUserId(userId))
})

/** Send notification base on user preference */
app.post('/send-notifications', async (req: Request, res: Response) => {
    // TODO validate user exists

    // parse input and user preferences

    // if need to send an email -> create a promise

    // if need to send sms -> create a promise

    // await 

    // catch errors

    // return response
})



export default app;