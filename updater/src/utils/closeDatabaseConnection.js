import db from '../db';
import logger from './logger';

const wait = (time) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });

const closeDatabaseConnection = async () => {
  try {
    logger.info('Closing db connection...');
    await wait(3000);
    await db.destroy()
    logger.info('db connection closed');
  } catch (error) { 
    logger.error(error)
  }
};

export default closeDatabaseConnection;
