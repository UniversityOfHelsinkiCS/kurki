import express from 'express';

import getFrozenCourses from '../utils/suotar/getFrozenCourses';
import getFrozenParticipantsByCourseId from '../utils/suotar/getFrozenParticipantsByCourseId';
import Osallistuminen from '../models/Osallistuminen';
import parseCourseId from '../utils/parseCourseId';

const router = express.Router();

router.get('/courses/frozen', async (req, res) => {
  const courses = await getFrozenCourses();

  res.send(courses);
});

router.get('/courses/:id/frozen-participants', async (req, res) => {
  const participants = await getFrozenParticipantsByCourseId(req.params.id);

  res.send(participants);
});

router.post('/courses/:id/students-transferred', async (req, res) => {
  const courseId = req.params.id;
  const { code, term, year, type, number } = parseCourseId(courseId);

  await Osallistuminen.query()
    .where({
      kurssikoodi: code,
      lukuvuosi: year,
      lukukausi: term,
      tyyppi: type,
      kurssiNro: number,
    })
    .patch({
      siirto: 'F',
    });

  res.send({ courseId });
});

export default router;
