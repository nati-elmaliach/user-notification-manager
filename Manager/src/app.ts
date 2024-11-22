import express from 'express';
import { json } from 'body-parser';
import axios from 'axios';

const app = express();
app.use(json());

app.post('/send-notifications', async (req, res) => {
    // TODO validate user exists

    // parse input and user preferences

    // if need to send an email -> create a promise

    // if need to send sms -> create a promise

    // await 

    // catch errors

    // return response
})

/** Create a new User Preference */
app.post('/user-preferences', async (req, res) => {
    // Validate input

    // Validate no dupes

    // save

    // return
})

app.put('/user-preferences', async (req, res) => {
    // Validate input

    // Validate no dupes

    // save

    // return
})

export default app;