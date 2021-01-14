import redis from '../redis';

import { UPDATER_LOGS_KEY } from '../../config';

const tryJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

const getLogMessages = async ({ first = 100 } = {}) => {
  const rawMessages = await redis.lrange(UPDATER_LOGS_KEY, 0, first - 1);

  const messages = rawMessages.map(tryJsonParse).filter(Boolean);

  return messages;
};

export default getLogMessages;
