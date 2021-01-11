import express from 'express';

import courseUnitRealisations from './courseUnitRealisations';
import persons from './persons';

const router = express.Router();

router.use('/course-unit-realisations', courseUnitRealisations);
router.use('/persons', persons);

export default router;
