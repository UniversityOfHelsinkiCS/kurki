import runDatabaseMigrations from './utils/runDatabaseMigrations';
import waitForDatabaseConnection from './utils/waitForDatabaseConnection';
import logger from './utils/logger';

const main = async () => {
  await waitForDatabaseConnection();
  await runDatabaseMigrations();
};

main()
  .then(() => {
    process.exit();
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
