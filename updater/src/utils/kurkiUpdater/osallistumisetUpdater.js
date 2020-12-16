import sisClient from '../sisClient';
import OpiskelijaUpdater from './opiskelijaUpdater';
import logger from '../logger';

class OsallistumisetUpdater {
  constructor({ kurssi }) {
    this.kurssi = kurssi;
  }

  getEnrolments() {
    return sisClient.getCourseUnitRealisationEnrolments(this.kurssi.sisId);
  }

  async update() {
    const enrolments = await this.getEnrolments();

    for (let enrolment of enrolments) {
      await this.updateOsallistuminen(enrolment).catch((error) => {
        logger.error('Failed to update enrolment', {
          enrolment,
        });

        logger.error(error);
      });
    }
  }

  async updateOsallistuminen(enrolment) {
    const { person } = enrolment;

    if (!person) {
      throw new Error(
        `Enrolment ${enrolment.id} does not contain student information`,
      );
    }

    const opiskelijaUpdater = new OpiskelijaUpdater({ person });
    const opiskelija = await opiskelijaUpdater.update();

    // TODO: create osallistuminen
  }
}

export default OsallistumisetUpdater;
