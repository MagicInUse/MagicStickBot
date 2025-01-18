import express from 'express';
import twitchRouter from './twitch/index.js';

const router = express.Router();

// ${BASE_URL}/twitch
router.use('/twitch', twitchRouter);

export default router;