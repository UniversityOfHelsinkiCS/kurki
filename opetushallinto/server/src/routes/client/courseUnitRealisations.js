import express from 'express';

import getCourseUnitRealisationsByProgramme from '../../utils/getCourseUnitRealisationsByProgramme';
import addTeacherForCourseUnitRealisation from '../../utils/addTeacherForCourseUnitRealisation';
import getCourseUnitRealisationById from '../../utils/getCourseUnitRealisationById';
import courseUnitRealisationWithKurkiFields from '../../utils/courseUnitRealisationWithKurkiFields';
import courseUnitRealisationArrayWithKurkiFields from '../../utils/courseUnitRealisationArrayWithKurkiFields';
import Kurssi from '../../models/Kurssi';

const router = express.Router();

router.get('/programme/:programmeCode', async (req, res) => {
  const { programmeCode } = req.params;

  const courseUnitRealisations = await getCourseUnitRealisationsByProgramme(
    programmeCode,
  );

  const withKurkiFields = await courseUnitRealisationArrayWithKurkiFields(
    courseUnitRealisations,
  );

  res.send(withKurkiFields);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const courseUnitRealisation = await getCourseUnitRealisationById(id);

  const withKurkiFields = await courseUnitRealisationWithKurkiFields(
    courseUnitRealisation,
  );

  res.send(withKurkiFields);
});

router.post('/:id/freeze', async (req, res) => {
  const { id } = req.params;

  await Kurssi.query()
    .findOne({
      sisId: id,
    })
    .patch({
      tila: 'J',
    });

  res.send({ id });
});

router.post('/:id/teachers', async (req, res) => {
  const {
    params: { id },
    body,
  } = req;

  const { personId } = body;

  const payload = {
    courseUnitRealisationId: id,
    personId,
  };

  await addTeacherForCourseUnitRealisation(payload);

  res.send(payload);
});

export default router;
