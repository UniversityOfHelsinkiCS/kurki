import { orderBy } from 'lodash';

import redis from '../redis';
import { UPDATER_STATUS_REPORTS_KEY } from '../../config';
import tryJsonParse from '../tryJsonParse';

const normalizeReport = (report) => {
  const parsed = tryJsonParse(report);

  return {
    ...parsed,
    startDate: parsed.startDate ? new Date(parsed.startDate) : null,
    endDate: parsed.endDate ? new Date(parsed.endDate) : null,
  };
};

const getStatusReports = async ({ first = 10 } = {}) => {
  const rawReports = await redis.lrange(UPDATER_STATUS_REPORTS_KEY, 0, -1);

  const reports = rawReports.map(normalizeReport).filter(Boolean);

  const sortedReports = orderBy(reports, ({ startDate }) =>
    startDate ? -startDate : -new Date(0),
  );

  return sortedReports.slice(0, first);
};

export default getStatusReports;
