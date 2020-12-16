import { get, maxBy, minBy } from 'lodash';

const paaAineByOrganizationCode = {
  H90: 'EL',
  H70: 'VAL',
  H40: 'HUM',
  H50: 'MAT',
  H60: 'KAS',
  H30: 'LÄÄ',
  H10: 'TEO',
  H57: 'BIO',
  H20: 'OIK',
  H80: 'MM',
  H930: 'AVO',
};

const getStartingYear = (studyRights) => {
  const earliest = minBy(
    studyRights,
    ({ valid: { startDate } }) => new Date(startDate),
  );

  return earliest ? new Date(earliest.valid.startDate).getFullYear() : null;
};

const getPaaAineByStudyRight = (studyRight) => {
  const { organization } = studyRight;

  if (!get(organization, 'code')) {
    return '?';
  }

  const { code } = organization;

  const paaAineByCode = paaAineByOrganizationCode[code];

  if (!paaAineByCode) {
    return 'MUU';
  }

  if (paaAineByCode !== 'MAT') {
    return paaAineByCode;
  }

  // TODO: department? https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/c1929a270bf34ad34b837e9be38ccb0f339a053e/oodi_integration/lib/kurki.rb#L168
  return 'ML';
};

const getPrimaryStudyRight = (studyRights) => {
  const activeStudyRights = studyRights.filter(
    ({ state }) => state === 'ACTIVE',
  );

  const mostRecent = maxBy(
    activeStudyRights,
    ({ valid: { startDate } }) => new Date(startDate),
  );

  return mostRecent;
};

const getOpiskelijaByStudyRights = (studyRights) => {
  const primaryStudyRight = getPrimaryStudyRight(studyRights);
  const aloitusvuosi = getStartingYear(studyRights);
  const paaAine = getPaaAineByStudyRight(primaryStudyRight);

  return { aloitusvuosi, paaAine };
};

export default getOpiskelijaByStudyRights;
