import kurkiUpdater from './utils/kurkiUpdater';
import logger from './utils/logger';
import waitForDatabaseConnection from './utils/waitForDatabaseConnection';

const main = async () => {
  await waitForDatabaseConnection();

  await kurkiUpdater.updateCourseUnitsByCodes(['TKT20010']);
};

main().catch((error) => logger.error(error));
