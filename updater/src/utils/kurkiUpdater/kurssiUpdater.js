import models from '../../models';
import logger from '../logger';
import sisClient from '../sisClient';
import getKurssiByCourseUnitRealisation from './getKurssiByCourseUnitRealisation';
import getKurssiOmistajaByResponsibilityInfos from './getKurssiOmistajaByResponsibilityInfos';
import getLecturersByResponsibilityInfos from './getLecturersByResponsibilityInfos';
import getOpetuksetByKurssi from './getOpetuksetByKurssi';
import { KURKI_FALLBACK_KURSSI_OMISTAJA } from '../../config';

class KurssiUpdater {
  constructor({ courseUnitRealisation, opintojakso }) {
    this.courseUnitRealisation = courseUnitRealisation;
    this.opintojakso = opintojakso;
  }

  getResponsibilityInfos() {
    return sisClient.getCourseUnitRealisationResponsibilityInfos(
      this.courseUnitRealisation.id,
    );
  }

  async update() {
    const responsibilityInfos = await this.getResponsibilityInfos();

    const owner = getKurssiOmistajaByResponsibilityInfos(responsibilityInfos);

    const ownerHenkilo = owner
      ? await models.Henkilo.query().patchOrInsertAndFetchByPerson(owner)
      : undefined;

    const kurssiPayload = {
      ...getKurssiByCourseUnitRealisation(this.courseUnitRealisation),
      kurssikoodi: this.opintojakso.kurssikoodi,
      omistaja: ownerHenkilo
        ? ownerHenkilo.htunnus
        : KURKI_FALLBACK_KURSSI_OMISTAJA,
    };

    await models.Kurssi.query().patchOrInsertWithKurssiNro(kurssiPayload);

    this.kurssi = await models.Kurssi.query().findBySisId(
      this.courseUnitRealisation.id,
    );

    await this.updateOpetukset();

    if (!this.kurssi.isExam()) {
      await this.updateLecturers(responsibilityInfos);
    }

    return this.kurssi;
  }

  async updateLecturers(responsibilityInfos) {
    const persons = getLecturersByResponsibilityInfos(responsibilityInfos);

    await Promise.all(
      persons.map((person) => {
        this.updateOpetustehtavanHoitoForPerson(person, 0, 'LU');
      }),
    );
  }

  async updateOpetustehtavanHoitoForPerson(person, ryhmaNro, opetustehtava) {
    const henkilo = person
      ? await models.Henkilo.query().patchOrInsertAndFetchByPerson(person)
      : undefined;

    const {
      kurssikoodi,
      lukukausi,
      lukuvuosi,
      tyyppi,
      kurssiNro,
    } = this.kurssi;

    if (henkilo) {
      const { htunnus } = henkilo;

      const opetustehtavanHoitoId = [
        kurssikoodi,
        lukukausi,
        lukuvuosi,
        tyyppi,
        kurssiNro,
        ryhmaNro,
        htunnus,
        opetustehtava,
      ];

      const opetustehtavanHoito = {
        kurssikoodi,
        lukukausi,
        lukuvuosi,
        tyyppi,
        kurssiNro,
        ryhmaNro,
        htunnus,
        opetustehtava,
      };

      await models.OpetustehtavanHoito.query().patchOrInsertById(
        opetustehtavanHoitoId,
        opetustehtavanHoito,
      );
    }
  }

  async getOpetukset() {
    return getOpetuksetByKurssi(this.kurssi);
  }

  async updateOpetukset() {
    const opetukset = await this.getOpetukset();

    for (let opetus of opetukset) {
      const { teacher, ...restOpetus } = opetus;

      await this.updateOpetus(restOpetus, teacher).catch((error) => {
        logger.error('Failed to update study group', {
          studyGroup: opetus,
        });

        logger.error(error);
      });
    }
  }

  async updateOpetus(opetus, teacher) {
    const {
      kurssikoodi,
      lukukausi,
      lukuvuosi,
      tyyppi,
      kurssiNro,
      ryhmaNro,
    } = opetus;

    const opetusId = [
      kurssikoodi,
      lukukausi,
      lukuvuosi,
      tyyppi,
      kurssiNro,
      ryhmaNro,
    ];

    await models.Opetus.query().patchOrInsertById(opetusId, opetus);

    await this.updateOpetustehtavanHoitoForPerson(teacher, ryhmaNro, 'HT');
  }
}

export default KurssiUpdater;
