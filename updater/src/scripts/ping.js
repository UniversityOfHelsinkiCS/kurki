import logger from '../utils/logger';
import db from '../db';
import closeDatabaseConnection from '../utils/closeDatabaseConnection';

const main = async () => {
  logger.info("ping!")
  const data = await db.table('opintojakso').select('*').limit(1);
  logger.info(data)
  await closeDatabaseConnection();
};

main().catch((error) => logger.error(error));