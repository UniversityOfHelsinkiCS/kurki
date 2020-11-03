import { isNumber } from 'lodash';

import sisClient from '../sisClient';
import getOpetuksetByStudyGroupSets from './getOpetuksetByStudyGroupSets';

const getExamOpetukset = (kurssi) => {
  const { sisId } = kurssi;

  return [{ ryhmaNro: 1, ilmoJnro: 1, sisId }];
};

const getDefaultOpetukset = (kurssi, opetukset) => {
  const { sisId } = kurssi;

  const group99 = opetukset.find(({ ilmoJnro }) => ilmoJnro === 99);

  return [
    { ryhmaNro: 0, ilmoJnro: null, sisId },
    ...(group99 ? [{ ryhmaNro: 1, ilmoJnro: 99, sisId: group99.sisId }] : []),
  ];
};

const getOpetuksetByKurssi = async (kurssi) => {
  const {
    kurssikoodi,
    lukukausi,
    lukuvuosi,
    tyyppi,
    kurssiNro,
    sisId,
  } = kurssi;

  const groupSets = !kurssi.isExam()
    ? await sisClient.getCourseUnitRealisationStudyGroupSets(sisId)
    : [];

  const baseOpetukset = getOpetuksetByStudyGroupSets(groupSets, kurssi);

  let opetukset = [];

  if (kurssi.isExam()) {
    opetukset = getExamOpetukset(kurssi);
  } else if (kurssi.isCourse()) {
    opetukset = baseOpetukset;
  } else {
    opetukset = getDefaultOpetukset(kurssi, baseOpetukset);
  }

  return opetukset.map((opetus) => ({
    ...opetus,
    kurssikoodi,
    lukukausi,
    lukuvuosi,
    tyyppi,
    kurssiNro,
    ilmo: 'K',
    opetustehtava: isNumber(opetus.ilmoJnro) ? 'LH' : 'LU',
  }));
};

export default getOpetuksetByKurssi;
