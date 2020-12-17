import kurkiUpdater from '../utils/kurkiUpdater';
import logger from '../utils/logger';

const main = async (codes) => {
  await kurkiUpdater.updateCourseUnitsByCodes(codes);
};

const courses = process.argv.slice(2, process.argv.length)

if (courses.length > 0) {
  main(courses).catch((error) => logger.error(error));
} else {
  console.log("give course codes as parameter")
}