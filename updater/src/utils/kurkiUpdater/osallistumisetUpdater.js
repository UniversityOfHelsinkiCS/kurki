import sisClient from '../sisClient';

class OsallistumisetUpdater {
  constructor({ kurssi }) {
    this.kurssi = kurssi;
  }

  getEnrolments() {
    return sisClient.getCourseUnitRealisationEnrolments(this.kurssi.sisId);
  }

  async update() {
    const enrolments = await this.getEnrolments();

    console.log(enrolments);
  }
}

export default OsallistumisetUpdater;
