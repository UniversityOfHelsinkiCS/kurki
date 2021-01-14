import Redis from 'ioredis';

import { REDIS_URI } from '../config';

const redis = new Redis(REDIS_URI);

export default redis;
