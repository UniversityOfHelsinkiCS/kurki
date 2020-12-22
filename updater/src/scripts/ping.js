import logger from '../utils/logger';
import db from '../db';
import closeDatabaseConnection from '../utils/closeDatabaseConnection';

const main = async () => {
  console.log("acual ping")
  const data = await db.table('opintojakso').select('*').limit(1);
  console.log(data)
  await closeDatabaseConnection();
};

main().catch((error) => logger.error(error));