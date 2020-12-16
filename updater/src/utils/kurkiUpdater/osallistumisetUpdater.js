import sisClient from '../sisClient';
import OpiskelijaUpdater from './opiskelijaUpdater';
import logger from '../logger';
import models from '../../models';
import getOsallistuminenByEnrolment from './getOsallistuminenByEnrolment';

class OsallistumisetUpdater {
  constructor({ kurssi }) {
    this.kurssi = kurssi;
  }

  getEnrolments() {
    return sisClient.getCourseUnitRealisationEnrolments(this.kurssi.sisId);
  }

  getOpetukset() {
    const {
      kurssikoodi,
      lukukausi,
      lukuvuosi,
      tyyppi,
      kurssiNro,
    } = this.kurssi;

    return models.Opetus.query().where({
      kurssikoodi,
      lukukausi,
      lukuvuosi,
      tyyppi,
      kurssiNro,
    });
  }

  async update() {
    const opetukset = await this.getOpetukset();
    const enrolments = await this.getEnrolments();

    for (let enrolment of enrolments) {
      await this.updateOsallistuminen(enrolment, opetukset).catch((error) => {
        logger.error('Failed to update enrolment', {
          enrolment,
        });

        logger.error(error);
      });
    }
  }

  async updateOsallistuminen(enrolment, opetukset) {
    const { student } = enrolment;

    if (!student) {
      throw new Error(
        `Enrolment ${enrolment.id} does not contain student information`,
      );
    }

    const osallistuminenPayload = getOsallistuminenByEnrolment(
      enrolment,
      opetukset,
    );

    const opiskelijaUpdater = new OpiskelijaUpdater({ person: student });
    const opiskelija = await opiskelijaUpdater.update();

    const id = [
      osallistuminenPayload.kurssikoodi,
      osallistuminenPayload.lukukausi,
      osallistuminenPayload.lukuvuosi,
      osallistuminenPayload.tyyppi,
      osallistuminenPayload.kurssiNro,
      osallistuminenPayload.ryhmaNro,
      opiskelija.hetu,
    ];

    await models.Osallistuminen.query().patchOrInsertById(id, {
      ...osallistuminenPayload,
      hetu: opiskelija.hetu,
    });
  }
}

export default OsallistumisetUpdater;
