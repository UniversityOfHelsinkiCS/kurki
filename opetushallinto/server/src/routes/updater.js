import express from 'express';

import createLogMessage from '../utils/updater/createLogMessage';
import getLogMessages from '../utils/updater/getLogMessages';
import createStatusReport from '../utils/updater/createStatusReport';
import getStatusReports from '../utils/updater/getStatusReports';

const router = express.Router();

const toInt = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  const number = parseInt(value);

  if (isNaN(number)) {
    return fallback;
  }

  return number;
};

router.get('/logs', async (req, res) => {
  const first = toInt(req.params.first, 50);

  const logMessages = await getLogMessages({ first });

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

router.post('/status-reports', async (req, res) => {
  const { startDate, endDate } = req.body;

  const statusReport = await createStatusReport({ startDate, endDate });

  res.send(statusReport);
});

router.get('/status-reports', async (req, res) => {
  const first = toInt(req.params.first, 10);

  const statusReports = await getStatusReports({ first });

  res.send(statusReports);
});

export default router;
