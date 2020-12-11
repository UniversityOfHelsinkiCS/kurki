import sisClient from '../sisClient';
import OpiskelijaUpdater from './opiskelijaUpdater';

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
          kurssi: this.kurssi,
          enrolment,
        });

        logger.error(error);
      });
    }
  }

  async updateOsallistuminen(enrolment) {
    const { personId } = enrolment;

    const person = await sisClient.getStudentById(personId);
    const opiskelijaUpdater = new OpiskelijaUpdater({ person });
    const opiskelija = await opiskelijaUpdater.update();

    // TODO: create osallistuminen
  }
}

export default OsallistumisetUpdater;
