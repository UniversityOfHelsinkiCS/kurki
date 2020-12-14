import knex from 'knex';

import waitForDatabaseConnection from './utils/waitForDatabaseConnection';
import logger from './utils/logger';

const main = async () => {
  await waitForDatabaseConnection();
  await knex.migrate.latest();
};

main().catch((error) => logger.error(error));
