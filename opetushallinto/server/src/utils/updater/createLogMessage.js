import { isString } from 'lodash';
import { nanoid } from 'nanoid';

import { UPDATER_LOGS_KEY, UPDATER_LOGS_MAX_SIZE } from '../../config';
import { UserInputError } from '../../errors';
import redis from '../redis';

const createLogMessage = async ({ level, message, meta, timestamp }) => {
  if (!isString(level)) {
    throw new UserInputError('Level is required');
  }

  if (!isString(message)) {
    throw new UserInputError('Message is required');
  }

  const payload = {
    id: nanoid(),
    timestamp: timestamp || new Date(),
    level,
    message,
    meta: meta || null,
  };

  await redis
    .multi()
    .lpush(UPDATER_LOGS_KEY, JSON.stringify(payload))
    .ltrim(UPDATER_LOGS_KEY, 0, UPDATER_LOGS_MAX_SIZE - 1)
    .exec();

  return payload;
};

export default createLogMessage;
