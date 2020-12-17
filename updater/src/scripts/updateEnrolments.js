import kurkiUpdater from '../utils/kurkiUpdater';
import logger from '../utils/logger';

const main = async (codes) => {
  await kurkiUpdater.updateEnrolmentsByCode(codes);
};


if (process.argv.length > 2) {
  main(process.argv[2]).catch((error) => logger.error(error));
} else {
  console.log("give course code as parameter")
}