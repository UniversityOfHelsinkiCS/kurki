import kurkiUpdater from './utils/kurkiUpdater';
import logger from './utils/logger';
import waitForDatabaseConnection from './utils/waitForDatabaseConnection';
import runDatabaseMigrations from './utils/runDatabaseMigrations';

const main = async () => {
  await waitForDatabaseConnection();
  await runDatabaseMigrations();

  await kurkiUpdater.updateCourseUnitsByCodes(['TKT10004']);
};

main().catch((error) => logger.error(error));
