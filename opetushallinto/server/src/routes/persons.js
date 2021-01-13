import express from 'express';

import getPersons from '../utils/getPersons';

const router = express.Router();

router.get('/', async (req, res) => {
  const persons = await getPersons();

  res.send(persons);
});

export default router;
