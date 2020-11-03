import createKnex from 'knex';

import { DB_CONFIG } from './config';

const db = createKnex(DB_CONFIG);

export default db;
