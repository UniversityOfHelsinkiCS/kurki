import logger from '../utils/logger';
import sisClient from '../utils/sisClient';
import kurkiUpdater from '../utils/kurkiUpdater';
import closeDatabaseConnection from '../utils/closeDatabaseConnection';
import tryCreateStatusReport from '../utils/tryCreateStatusReport';

const IGNORED_CODES = ['TKT20007'];

const VALID_PROGRAMMES = ['500-K005', '500-M009', '500-M010'];

const valid = (course) => {
  return (
    !IGNORED_CODES.includes(course.code) &&
    (course.validityPeriod.endDate === '2021-08-01' ||
      !course.validityPeriod.endDate)
  );
};

const updateProgramme = async (code) => {
  const courses = await sisClient.getCourseUnitsByProgramme(code);
  const validCourses = courses.filter(valid);
  const codes = validCourses.map((c) => c.code);

  await kurkiUpdater.updateCourseUnitsByCodes(codes);
  await kurkiUpdater.updateEnrolmentsByCodes(codes);
};

const main = async (codes) => {
  const invalidCode = codes.find((c) => !VALID_PROGRAMMES.includes(c));

  if (invalidCode || codes.length === 0) {
    logger.error('Give unit code as parameter: 500-K005 500-M009 500-M010');

    return;
  }

  const startDate = new Date();

  for (const code of codes) {
    await updateProgramme(code);
  }

  const endDate = new Date();

  await tryCreateStatusReport({ startDate, endDate });
  await closeDatabaseConnection();
};

main(process.argv.slice(2)).catch((error) => logger.error(error));
