import kurkiUpdater from '../utils/kurkiUpdater';
import logger from '../utils/logger';
import closeDatabaseConnection from '../utils/closeDatabaseConnection';

const main = async (codes) => {
  await kurkiUpdater.updateEnrolmentsByCodes(codes);
  await closeDatabaseConnection();
};

const courses = process.argv.slice(2, process.argv.length)

if (process.argv.length > 2) {
  main(courses).catch((error) => logger.error(error));
} else {
  console.log("give course code as parameter")
}