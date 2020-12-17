
import logger from '../utils/logger';
import db from '../db';

const main = async () => {
  console.log("Ping")
  const data = await db.table('opintojakso').select('*').limit(1);
  console.log(data)
};

main().catch((error) => logger.error(error));