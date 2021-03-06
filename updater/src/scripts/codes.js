import logger from '../utils/logger';
import sisClient from '../utils/sisClient'

const wait = (time) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });

const valid = (course) => {
  return course.validityPeriod.endDate === '2021-08-01' || !course.validityPeriod.endDate
} 

const main = async (code) => {
  const courses = await sisClient.getCourseUnitsByProgramme(code)
  const validCourses = courses.filter(valid)
  validCourses.forEach(course => {
    console.log(`${course.code} ${course.name.fi}`)
  });

  const str = validCourses.reduce((str, c) => str.concat(" "+c.code), "")
  console.log(str)
};

if (process.argv.length > 1 && ["500-K005", "500-M009","500-M010"].includes(process.argv[2]) ) {
  main(process.argv[2]).catch((error) => logger.error(error));
} else {
  logger.info("give unit code as parameter: 500-K005 500-M009 500-M010")
}