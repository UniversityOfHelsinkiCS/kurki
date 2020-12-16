import path from 'path';

import logger from './logger';
import db from '../db';

const runDatabaseMigrations = async () => {
  try {
    await db.raw('DELETE FROM "knex_migrations_lock" WHERE "is_locked" = 1');
  } catch (err) {
    logger.info('Could not delete migrations lock');
  }

  await db.migrate.latest({
    directory: path.join(__dirname, '..', '..', 'migrations'),
  });

  logger.info('Database migrations have been executed successfully');
};

export default runDatabaseMigrations;
