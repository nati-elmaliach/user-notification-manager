import { Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import { ValidateCreateUserPreferences } from './middlewares/validations';

const app = express();
app.use(json());

/** Create a new User Preference */
app.post('/user-preferences', ValidateCreateUserPreferences, async (req: Request, res: Response) => {
    // Validate input

    // Validate no dupes

    // save

    // return

    res.json({status: "OK"})
})

/** Update a user Preference  */
app.put('/user-preferences', async (req, res) => {
    // Validate input

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