import useSWR from 'swr';

import getCourseUnitRealisationsByProgramme from '../utils/getCourseUnitRealisationsByProgramme';

const prefix = 'useCourseUnitRealisationsByProgramme';

const getKey = (programmeCode) => {
  return programmeCode ? [prefix, programmeCode] : null;
};

const getCourseUnitRealisationsByProgrammeFetcher = (prefix, programmeCode) => {
  return getCourseUnitRealisationsByProgramme(programmeCode);
};

const useCourseUnitRealisationsByProgramme = (programmeCode) => {
  const key = getKey(programmeCode);

  const { data, ...rest } = useSWR(
    key,
    getCourseUnitRealisationsByProgrammeFetcher,
  );

  return { courseUnitRealisation: data, ...rest };
};

export default useCourseUnitRealisationsByProgramme;
