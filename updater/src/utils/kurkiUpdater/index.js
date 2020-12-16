import sisClient from '../sisClient';
import logger from '../logger';
import getDistinctCourseUnits from './getDistinctCourseUnits';
import OpintojaksoUpdater from './opintojaksoUpdater';

export class KurkiUpdater {
  async updateCourseUnitsByCodes(codes) {
    const allCourseUnits = await sisClient.getCourseUnitsByCodes(codes);
    const courseUnits = getDistinctCourseUnits(allCourseUnits);

    return this.updateOpintojaksot(courseUnits);
  }

  async updateCourseUnitsByProgamme(programme) {
    const allCourseUnits = await sisClient.getCourseUnitsByProgramme(programme);

    const courseUnits = getDistinctCourseUnits(allCourseUnits);

    return this.updateOpintojaksot(courseUnits);
  }

  async updateOpintojaksot(courseUnits) {
    logger.info(`Starting to update ${courseUnits.length} courses`);

    for (let courseUnit of courseUnits) {
      await this.updateOpintojakso(courseUnit).catch((error) => {
        logger.error('Failed to update course unit', {
          courseUnit,
        });

        logger.error(error);
      });
    }

    logger.info(
      `Finished updating ${courseUnits.length} courses. Check logs for possible errors`,
    );
  }

  async updateOpintojakso(courseUnit) {
    const updater = new OpintojaksoUpdater({
      courseUnit,
    });
    console.log(`updating updateOpintojakso ${courseUnit.code} ${courseUnit.name.fi} ${courseUnit.id}` )
    await updater.update();
  }
}

export default new KurkiUpdater();
