import { nanoid } from 'nanoid';

import {
  UPDATER_STATUS_REPORTS_KEY,
  UPDATER_STATUS_REPORTS_MAX_SIZE,
} from '../../config';

import redis from '../redis';

const createLogMessage = async ({ startDate, endDate }) => {
  const payload = {
    id: nanoid(),
    startDate: startDate || new Date(),
    endDate: endDate || new Date(),
  };

  await redis
    .multi()
    .lpush(UPDATER_STATUS_REPORTS_KEY, JSON.stringify(payload))
    .ltrim(UPDATER_STATUS_REPORTS_KEY, 0, UPDATER_STATUS_REPORTS_MAX_SIZE - 1)
    .exec();

  return payload;
};

export default createLogMessage;
