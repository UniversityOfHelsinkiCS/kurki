import express from 'express';

import verifyAdmin from '../middlewares/verifyAdmin';
import verifyApiKey from '../middlewares/verifyApiKey';
import client from './client';
import courses from './courses';
import updater from './updater';

const router = express.Router();

router.use('/client', verifyAdmin, client);

router.use(verifyApiKey);

router.use('/courses', courses);
router.use('/updater', updater);

export default router;
