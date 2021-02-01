import { subMonths } from 'date-fns';

import sisClient from '../sisClient';
import logger from '../logger';
import getDistinctCourseUnits from './getDistinctCourseUnits';
import OpintojaksoUpdater from './opintojaksoUpdater';
import models from '../../models';
import OsallistumisetUpdater from './osallistumisetUpdater';

const createActiveKurssitQueryBuilder = (builder) => {
  return builder.where('paattymisPvm', '>', subMonths(new Date(), 3));
};

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

    logger.info(
      `updating ${courseUnit.code} ${courseUnit.name.fi} ${courseUnit.id} ${courseUnit.activityPeriod}`,
    );

    await updater.update();
  }

  async updateEnrolmentsByCodes(codes) {
    for (let code of codes) {
      await this.updateEnrolmentsByCode(code);
    }
  }

  async updateEnrolmentsByCode(code) {
    const kurssit = await createActiveKurssitQueryBuilder(
      models.Kurssi.query().where({ kurssikoodi: code }),
    );

    const validCourses = kurssit.filter(
      (k) => process.env.ENROLL_ALL || k.lukuvuosi > 2020,
    );

    await this.updateOsallistumisetForKurssit(validCourses);
  }

  async updateOsallistumisetForKurssit(kurssit) {
    logger.info(`Starting to update enrolments for ${kurssit.length} courses`);

    for (let kurssi of kurssit) {
      await this.updateOsallistumiset(kurssi).catch((error) => {
        logger.error('Failed to update enrolments', {
          kurssi,
        });

        logger.error(error);
      });
    }

    logger.info(
      `Finished updating enrolments for ${kurssit.length} courses. Check logs for possible errors`,
    );
  }

  async updateOsallistumiset(kurssi) {
    const updater = new OsallistumisetUpdater({
      kurssi,
    });

    await updater.update();
  }
}

export default new KurkiUpdater();
