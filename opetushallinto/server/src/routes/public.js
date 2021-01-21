import express from 'express';

import getLabtoolCourses from '../utils/labtool/getLabtoolCourses';
import { UserInputError } from '../errors';

const router = express.Router();

router.get('/labtool/courses', async (req, res) => {
  const { year, term } = req.query;

  if (!term) {
    throw new UserInputError('Term is required');
  }

  const parsedYear = parseInt(year);

  if (isNaN(parsedYear)) {
    throw new UserInputError('Year is required');
  }

  const courses = await getLabtoolCourses({ year: parsedYear, term });

  res.send(courses);
});

export default router;
