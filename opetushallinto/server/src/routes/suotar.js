import express from 'express';

import getFrozenCourses from '../utils/suotar/getFrozenCourses';
import getFrozenParticipantsByCourseId from '../utils/suotar/getFrozenParticipantsByCourseId';
import Osallistuminen from '../models/Osallistuminen';
import parseCourseId from '../utils/parseCourseId';
import Kurssi from '../models/Kurssi';

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

  const kurssiFields = {
    kurssikoodi: code,
    lukuvuosi: year,
    lukukausi: term,
    tyyppi: type,
    kurssiNro: number,
  };

  await Kurssi.query().where(kurssiFields).patch({
    siirto: 'F',
  });

  await Osallistuminen.query().where(kurssiFields).patch({
    siirto: 'F',
  });

  res.send({ courseId });
});

router.get('/teachers', async (req, res) => {
  const courses = await Kurssi.query()
    .distinct('omistaja')
    .withGraphFetched('omistajaHenkilo')
    .modifyGraph('omistajaHenkilo', (builder) => {
      return builder
        .whereNotNull('ktunnus')
        .select('sahkopostiosoite', 'ktunnus', 'etunimet', 'sukunimi');
    });

  const teachers = courses
    .map(({ omistajaHenkilo }) => omistajaHenkilo)
    .filter(Boolean)
    .map(({ sahkopostiosoite, ktunnus, etunimet, sukunimi }) => ({
      email: sahkopostiosoite,
      username: ktunnus,
      firstName: etunimet,
      lastName: sukunimi,
    }));

  res.send(teachers);
});

export default router;
