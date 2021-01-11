import createKnex from 'knex';

import { KURKI_KNEX_CONFIG } from '../config';

const knex = createKnex(KURKI_KNEX_CONFIG);

export default knex;
