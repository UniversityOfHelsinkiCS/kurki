import db from '../db';
import logger from './logger';

const wait = (time) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });

const waitForDatabaseConnection = async (retryCounter = 0) => {
  try {
    await db.table('opintojakso').select('*').limit(1);
  } catch (error) {
    if (retryCounter > 20) {
      throw new Error('Database connection timeout');
    }

    await wait(3000);

    logger.info('No database connection, retrying...');
    await waitForDatabaseConnection();
  }
};

export default waitForDatabaseConnection;
