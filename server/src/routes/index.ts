import express from 'express';
import twitchRouter from './twitch/index.js';
// import apiRouter from './api';

const router = express.Router();

router.use('/twitch', twitchRouter);
// app.use('/api', apiRouter);

export default router;