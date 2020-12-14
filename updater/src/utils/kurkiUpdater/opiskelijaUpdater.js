import models from '../../models';
import getOpiskelijaByPerson from './getOpiskelijaByPerson';
import getOpiskelijaByStudyRights from './getOpiskelijaByStudyRights';

class OpiskelijaUpdater {
  constructor({ person }) {
    this.person = person;
  }

  update() {
    const opiskelijaPayload = {
      ...getOpiskelijaByPerson(this.person),
      ...getOpiskelijaByStudyRights(this.person.studyrights)
    };

    const { hetu } = opiskelijaPayload;

    if (!hetu) {
      throw new Error(`Student ${this.person.id} does not have a student number`);
    }

    await models.Opiskelija.query().patchOrInsertById(hetu, opiskelijaPayload);

    this.opiskelija = await models.Opiskelija.query().findById(hetu);

    return this.opiskelija;
  }
}

export default OpiskelijaUpdater;
