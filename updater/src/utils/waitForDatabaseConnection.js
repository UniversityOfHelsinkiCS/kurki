import db from '../db';
import logger from './logger';

const wait = (time) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });

const waitForDatabaseConnection = async () => {
  try {
    await db.table('opintojakso').select('*').limit(1);
  } catch (error) {
    await wait(5000);
    console.log(error)
    logger.info('No database connection, retrying...');
    await waitForDatabaseConnection();
  }
};

export default waitForDatabaseConnection;
