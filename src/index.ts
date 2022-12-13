import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { appConfig } from './config';
import { webhookRouter } from './webhook/api';

// Initialize Firebase app using GOOGLE_APPLICATION_CREDENTIALS env.
initializeApp({
  credential: applicationDefault(),
});

// Create express application.
const app = express();

// Convert request body with application/json content type into JS data structures.
app.use(bodyParser.json({ limit: '100kb' }));

app.use(webhookRouter);

// Start listening for requests.
app.listen(appConfig.server.port, () => {
  console.log(`Server is listening on port ${appConfig.server.port}`);
});
