import { get } from 'lodash';
import { getYear, isValid, getMonth, getDate } from 'date-fns';

import getLastUrnPart from '../getLastUrnPart';

const kielikoodiByLanguageCode = {
  fi: 'S',
  en: 'E',
  se: 'R',
};

const tyyppiByCourseUnitRealisationType = {
  'independent-work-essay': 'K',
  'exam-electronic': 'L',
  'exam-final': 'L',
  'teaching-participation-field-course': 'K',
  'teaching-participation-small-group': 'K',
  'independent-work-project': 'A',
  'teaching-participation-seminar': 'S',
  'thesis-doctoral': 'Y',
  'licentiate-thesis': 'Y',
  'independent-work-presentation': 'K',
  'training-training': 'K',
  'exam-exam': 'L',
  'teaching-participation-lab': 'A',
  'exam-midterm': 'L',
  'independent-work-learning-diary': 'K',
  'teaching-participation-lectures': 'K',
  'teaching-participation-online': 'K',
};

const tilaByFlowState = {
  PUBLISHED: 'I',
  CANCELLED: 'J',
  NOT_READY: 'O',
};

const getLukuvuosi = (dateLike) => {
  const date = new Date(dateLike);

  if (!isValid(date)) {
    return undefined;
  }

  return getYear(date);
};

const getLukukausi = (dateLike) => {
  const date = new Date(dateLike);

  if (!isValid(date)) {
    return undefined;
  }

  // Month index starts at 0
  const month = getMonth(date) + 1;
  const dayOfMonth = getDate(date);

  if (month < 5) {
    return 'K';
  } else if (month > 8 || (month === 8 && dayOfMonth > 20)) {
    return 'S';
  }

  return 'V';
};

const getKielikoodiByTeachingLanguageUrn = (teachingLanguageUrn) => {
  if (!teachingLanguageUrn) {
    return 'E';
  }

  const language = getLastUrnPart(teachingLanguageUrn);

  return kielikoodiByLanguageCode[language] || 'E';
};

const getTyyppiByCourseUnitRealisationTypeUrn = (
  courseUnitRealisationTypeUrn,
) => {
  if (!courseUnitRealisationTypeUrn) {
    return undefined;
  }

  const type = getLastUrnPart(courseUnitRealisationTypeUrn);

  return tyyppiByCourseUnitRealisationType[type] || 'K';
};

const getTilaByFlowState = (flowState) => {
  if (!flowState) {
    return undefined;
  }

  return tilaByFlowState[flowState] || 'O';
};

const getKurssiByCourseUnitRealisation = (courseUnitRealisation) => {
  const {
    activityPeriod,
    teachingLanguageUrn,
    courseUnitRealisationTypeUrn,
    flowState,
    name,
  } = courseUnitRealisation;

  const startDate = get(activityPeriod, 'startDate');
  const endDate = get(activityPeriod, 'endDate');

  return {
    sisId: courseUnitRealisation.id,
    lukuvuosi: getLukuvuosi(startDate),
    lukukausi: getLukukausi(startDate),
    tyyppi: getTyyppiByCourseUnitRealisationTypeUrn(
      courseUnitRealisationTypeUrn,
    ),
    kielikoodi: getKielikoodiByTeachingLanguageUrn(teachingLanguageUrn),
    opintoviikot: 1,
    nimi: get(name, 'fi'),
    tila: getTilaByFlowState(flowState),
    alkamisPvm: startDate ? new Date(startDate) : null,
    paattymisPvm: endDate ? new Date(endDate) : null,
  };
};

export default getKurssiByCourseUnitRealisation;
