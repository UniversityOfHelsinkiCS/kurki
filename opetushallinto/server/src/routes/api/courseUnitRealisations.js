import express from 'express';

import getCourseUnitRealisationsByProgramme from '../../utils/getCourseUnitRealisationsByProgramme';

const router = express.Router();

router.get('/programme/:programmeCode', async (req, res) => {
  const { programmeCode } = req.params;
  const courseUnitRealisations = await getCourseUnitRealisationsByProgramme(
    programmeCode,
  );

  res.send(courseUnitRealisations);
});

export default router;
