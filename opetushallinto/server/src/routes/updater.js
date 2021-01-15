import express from 'express';

import createLogMessage from '../utils/updater/createLogMessage';
import createStatusReport from '../utils/updater/createStatusReport';

const router = express.Router();

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

router.post('/status-reports', async (req, res) => {
  const { startDate, endDate } = req.body;

  const statusReport = await createStatusReport({ startDate, endDate });

  res.send(statusReport);
});

export default router;
