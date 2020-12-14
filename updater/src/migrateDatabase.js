import path from 'path';

import waitForDatabaseConnection from './utils/waitForDatabaseConnection';
import logger from './utils/logger';
import db from './db';

const main = async () => {
  await waitForDatabaseConnection();

  await db.migrate.latest({
    directory: path.join(__dirname, '..', 'migrations'),
  });
};

main()
  .then(() => {
    logger.info('Database migrations have been executed successfully')
    process.exit()
  })
  .catch((error) => {
    logger.error(error)
    process.exit(1)
  });
