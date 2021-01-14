import express from 'express';

import createLogMessage from '../utils/updater/createLogMessage';
import getLogMessages from '../utils/updater/getLogMessages';

const router = express.Router();

router.get('/logs', async (req, res) => {
  const { first = 50 } = req.params;
  const firstNumber = parseInt(first);

  const logMessages = await getLogMessages({ first: firstNumber });

  res.send(logMessages);
});

router.post('/logs', async (req, res) => {
  const { level, message, meta, timestamp } = req.body;

  const logMessage = await createLogMessage({
    level,
    message,
    meta,
    timestamp,
  });

  res.send(logMessage);
});

export default router;
