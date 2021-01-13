import express from 'express';

import getFrozenCourses from '../utils/getFrozenCourses';
import getFrozenParticipantsByCourseId from '../utils/getFrozenParticipantsByCourseId';

const router = express.Router();

router.get('/frozen', async (req, res) => {
  const courses = await getFrozenCourses();

  res.send(courses);
});

router.get('/:id/frozen-participants', async (req, res) => {
  const participants = await getFrozenParticipantsByCourseId(req.params.id);

  res.send(participants);
});

export default router;
