import path from 'path';
import kurkiUpdater from './utils/kurkiUpdater';
import logger from './utils/logger';
import waitForDatabaseConnection from './utils/waitForDatabaseConnection';
import db from './db';

const migrate = async () => {
  await waitForDatabaseConnection();

  try {
    await db.raw("DELETE FROM \"knex_migrations_lock\" WHERE \"is_locked\" = 1")
  } catch (err) {
    logger.info('Could not delete migrations lock')
  }

  await db.migrate.latest({
    directory: path.join(__dirname, '..', 'migrations'),
  });

  logger.info('Database migrations have been executed successfully')
};

const main = async () => {
  await waitForDatabaseConnection();

  await migrate()

  await kurkiUpdater.updateCourseUnitsByCodes(['TKT10004']);
};

main().catch((error) => logger.error(error));
