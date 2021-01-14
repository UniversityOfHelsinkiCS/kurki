import redis from '../redis';
import { UPDATER_STATUS_REPORTS_KEY } from '../../config';
import tryJsonParse from '../tryJsonParse';

const normalizeReport = (report) => tryJsonParse(report);

const getStatusReports = async ({ first = 10 } = {}) => {
  const rawMessages = await redis.lrange(
    UPDATER_STATUS_REPORTS_KEY,
    0,
    first - 1,
  );

  const messages = rawMessages.map(normalizeReport).filter(Boolean);

  return messages;
};

export default getStatusReports;
