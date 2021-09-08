import express from 'express';

import getLabtoolCourses from '../utils/labtool/getLabtoolCourses';
import parseCourseId from '../utils/parseCourseId';
import Kurssi from '../models/Kurssi';
import { UserInputError, NotFoundError } from '../errors';

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

router.get('/labtool/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { code, term, year, type, number } = parseCourseId(id);

  const kurssi = await Kurssi.query()
    .findOne({
      kurssikoodi: code,
      lukuvuosi: year,
      lukukausi: term,
      tyyppi: type,
      kurssiNro: number,
    })
    .withGraphFetched('[opetustehtavanHoidot.henkilo]');

  if (!kurssi) {
    throw new NotFoundError(`Course ${id} is not found`);
  }

  const teachers = kurssi.opetustehtavanHoidot
    .map((oh) => oh.henkilo.ktunnus)
    .filter(Boolean);

  res.send({
    teachers,
  });
});

export default router;
