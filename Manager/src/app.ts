import { json } from 'body-parser';
import express, { Request, Response } from 'express';

import { NotificationService } from './services/notification.service';
import { UserPreferencesManager } from './services/preferences.service';
import { ValidateUpdatePreferences } from './middlewares/update-preferences.middleware';
import { ValidateCreateUserPreferences } from './middlewares/create-preferences.middelware';
import { ValidateSendNotificationRequest } from './middlewares/send-notification.middelware';
import { CreateUserPreferencesRequest, NotificationRequest, UpdateUserPreferencesRequest } from './types';

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
        res.status(200).json(updatedPreferences);
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
})

/** Send notification base on user preference */
app.post('/send', ValidateSendNotificationRequest, async (req: Request, res: Response) => {
    try {
        const notificationReq: NotificationRequest = req.body;    
        const notificationRes = await userPreferencesManager.sendNotification(notificationReq);
        res.status(200).json(notificationRes);
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
})

/** Get preferences bu userId */
app.get('/preferences/:id', async (req: Request, res: Response)  => {
    const userId = Number(req.params.id);
    res.json(userPreferencesManager.getByUserId(userId))
})

export default app;