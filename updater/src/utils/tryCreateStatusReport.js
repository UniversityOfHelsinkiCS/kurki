import createStatusReport from './createStatusReport';
import logger from './logger';
import { SEND_REPORTS } from '../config';

const tryCreateStatusReport = async (payload) => {
  if (!SEND_REPORTS) {
    return;
  }

  try {
    const report = await createStatusReport(payload);

    return report;
  } catch (e) {
    logger.error('Failed to send status report to opetushallinto server');
    logger.error(e);
  }
};

export default tryCreateStatusReport;
