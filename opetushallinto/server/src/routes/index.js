import express from 'express';

import verifyAdmin from '../middlewares/verifyAdmin';
import verifyApiKey from '../middlewares/verifyApiKey';
import client from './client';
import suotar from './suotar';
import updater from './updater';
import publicRouter from './public';

const router = express.Router();

router.use('/public', publicRouter);

router.use('/client', verifyAdmin, client);

router.use(verifyApiKey);

router.use('/suotar', suotar);
router.use('/updater', updater);

export default router;
