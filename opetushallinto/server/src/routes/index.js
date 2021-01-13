import express from 'express';

import courseUnitRealisations from './courseUnitRealisations';
import persons from './persons';
import courses from './courses';

const router = express.Router();

router.use('/course-unit-realisations', courseUnitRealisations);
router.use('/persons', persons);
router.use('/courses', courses);

export default router;
