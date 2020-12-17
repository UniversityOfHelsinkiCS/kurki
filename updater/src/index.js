import kurkiUpdater from './utils/kurkiUpdater';
import logger from './utils/logger';
import waitForDatabaseConnection from './utils/waitForDatabaseConnection';
import runDatabaseMigrations from './utils/runDatabaseMigrations';

const main = async () => {
  const data = await waitForDatabaseConnection();
  console.log("Connected to DB")
  console.log(data)
  await runDatabaseMigrations();

  //await kurkiUpdater.updateCourseUnitsByCodes(['TKT21007']);
  //await kurkiUpdater.updateEnrolmentsByCode('TKT21007');
};

main().catch((error) => logger.error(error));
