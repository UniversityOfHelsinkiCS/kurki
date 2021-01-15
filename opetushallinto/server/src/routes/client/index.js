import express from 'express';

import courseUnitRealisations from './courseUnitRealisations';
import persons from './persons';
import updater from './updater';

const router = express.Router();

router.use('/course-unit-realisations', courseUnitRealisations);
router.use('/persons', persons);
router.use('/updater', updater);

export default router;
