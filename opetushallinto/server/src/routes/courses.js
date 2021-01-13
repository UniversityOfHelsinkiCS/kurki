import express from 'express';

import Kurssi from '../models/Kurssi';

const router = express.Router();

const getCourseByKurssi = (kurssi) => ({
  name: kurssi.nimi,
  code: kurssi.koodi,
  year: kurssi.lukuvuosi,
  term: kurssi.lukukausi,
  type: kurssi.tyyppi,
  number: kurssi.kurssiNro,
  startDate: kurssi.alkamisPvm,
  endDate: kurssi.paattymisPvm,
  finishDate: kurssi.suoritusPvm,
  ownerId: kurssi.omistaja,
});

router.get('/frozen', async (req, res) => {
  const kurssit = await Kurssi.query()
    .where({
      siirto: 'T',
      tila: 'J',
    })
    .orderBy('suoritusPvm');

  const courses = kurssit.map(getCourseByKurssi);

  res.send(courses);
});

export default router;
