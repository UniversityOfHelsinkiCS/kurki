import express from 'express';

import getCourseUnitRealisationsByProgramme from '../../utils/getCourseUnitRealisationsByProgramme';
import addResponsiblePersonForCourseUnitRealisation from '../../utils/addResponsiblePersonForCourseUnitRealisation';
import getCourseUnitRealisationById from '../../utils/getCourseUnitRealisationById';

const router = express.Router();

router.get('/programme/:programmeCode', async (req, res) => {
  const { programmeCode } = req.params;

  const courseUnitRealisations = await getCourseUnitRealisationsByProgramme(
    programmeCode,
  );

  res.send(courseUnitRealisations);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const courseUnitRealisation = await getCourseUnitRealisationById(id);

  res.send(courseUnitRealisation);
});

router.post('/:id/responsible-persons', async (req, res) => {
  const {
    params: { id },
    body,
  } = req;

  const { personId } = body;

  const payload = {
    courseUnitRealisationId: id,
    personId,
  };

  await addResponsiblePersonForCourseUnitRealisation(payload);

  res.send(payload);
});

export default router;
