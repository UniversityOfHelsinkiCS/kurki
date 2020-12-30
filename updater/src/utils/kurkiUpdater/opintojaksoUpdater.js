import { subMonths } from 'date-fns';

import models from '../../models';
import logger from '../logger';
import sisClient from '../sisClient';
import KurssiUpdater from './kurssiUpdater';
import getOpintojaksoByCourseUnit from './getOpintojaksoByCourseUnit';

class OpintojaksoUpdater {
  constructor({ courseUnit }) {
    this.courseUnit = courseUnit;
  }

  async update() {
    const opintojakso = getOpintojaksoByCourseUnit(this.courseUnit);
    const { kurssikoodi } = opintojakso;

    await models.Opintojakso.query().patchOrInsertById(
      kurssikoodi,
      opintojakso,
    );

    this.opintojakso = await models.Opintojakso.query().findById(kurssikoodi);

    await this.updateKurssit();

    return this.opintojakso;
  }

  async updateKurssit() {
    const { kurssikoodi } = this.opintojakso;

    const courseUnitRealisations = await sisClient.getCourseUnitRealisationsByCode(
      kurssikoodi,
      { activityPeriodEndDateAfter: subMonths(new Date(), 12) },
    )

    const validRealisations = courseUnitRealisations
      .filter(c => c.activityPeriod.endDate && new Date(c.activityPeriod.endDate).getFullYear()>2020)
    
      logger.info("  updateKurssit, realisations:")
    for (let realisation of validRealisations) {
      logger.info(`    ${realisation.id} ${realisation.assessmentItemIds} ${JSON.stringify(realisation.activityPeriod)}`)
      await this.updateKurssi(realisation).catch((error) => {
        logger.error('Failed to update course unit realisation', {
          courseUnit: this.courseUnit,
          courseUnitRealisation: realisation,
        });

        logger.error(error);
      });
    }
  }

  async updateKurssi(courseUnitRealisation) {
    const updater = new KurssiUpdater({
      opintojakso: this.opintojakso,
      courseUnitRealisation,
    });

    await updater.update();
  }
}

export default OpintojaksoUpdater;
