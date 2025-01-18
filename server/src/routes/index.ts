import express from 'express';
import twitchRouter from './twitch/index.js';
// import apiRouter from './api';

const router = express.Router();

// ${BASE_URL}/twitch
router.use('/twitch', twitchRouter);

// ${BASE_URL}/api
// app.use('/api', apiRouter);

export default router;