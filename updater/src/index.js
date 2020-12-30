import kurkiUpdater from './utils/kurkiUpdater';
import logger from './utils/logger';
import waitForDatabaseConnection from './utils/waitForDatabaseConnection';
import runDatabaseMigrations from './utils/runDatabaseMigrations';

const main = async () => {
  const data = await waitForDatabaseConnection();
  logger.info("Connected to DB");
  await runDatabaseMigrations();

  // acual shit happens with:
  // npm run courses
  // npm run enrolments
};

main().catch((error) => logger.error(error));
