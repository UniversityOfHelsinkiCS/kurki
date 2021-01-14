import redis from '../redis';
import { UPDATER_LOGS_KEY } from '../../config';
import tryJsonParse from '../tryJsonParse';

const normalizeMessage = (message) => tryJsonParse(message);

const getLogMessages = async ({ first = 100 } = {}) => {
  const rawMessages = await redis.lrange(UPDATER_LOGS_KEY, 0, first - 1);

  const messages = rawMessages.map(normalizeMessage).filter(Boolean);

  return messages;
};

export default getLogMessages;
