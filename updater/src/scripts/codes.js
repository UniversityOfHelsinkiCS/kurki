import kurkiUpdater from '../utils/kurkiUpdater';
import logger from '../utils/logger';
import closeDatabaseConnection from '../utils/closeDatabaseConnection';
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

const courses = process.argv.slice(2, process.argv.length)

if (courses.length > 0) {
  main(courses).catch((error) => logger.error(error));
} else {
  console.log("give unit code as parameter: 500-K005 500-M009 500-M010")
}