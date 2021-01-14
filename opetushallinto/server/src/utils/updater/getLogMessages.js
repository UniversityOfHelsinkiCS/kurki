import { orderBy } from 'lodash';

import redis from '../redis';
import { UPDATER_LOGS_KEY } from '../../config';
import tryJsonParse from '../tryJsonParse';

const normalizeMessage = (message) => {
  const parsed = tryJsonParse(message);

  return {
    ...parsed,
    timestamp: parsed.timestamp ? new Date(parsed.timestamp) : null,
  };
};

const getLogMessages = async ({ first = 100 } = {}) => {
  const rawMessages = await redis.lrange(UPDATER_LOGS_KEY, 0, -1);

  const messages = rawMessages.map(normalizeMessage).filter(Boolean);

  const sortedMessages = orderBy(messages, ({ timestamp }) =>
    timestamp ? -timestamp : -new Date(0),
  );

  return sortedMessages.slice(0, first);
};

export default getLogMessages;
