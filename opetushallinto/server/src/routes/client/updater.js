import express from 'express';

import getLogMessages from '../../utils/updater/getLogMessages';
import getStatusReports from '../../utils/updater/getStatusReports';

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

router.get('/status-reports', async (req, res) => {
  const first = toInt(req.params.first, 10);

  const statusReports = await getStatusReports({ first });

  res.send(statusReports);
});

export default router;
