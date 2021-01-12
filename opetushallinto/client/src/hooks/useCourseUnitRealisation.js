import useSWR from 'swr';

import getCourseUnitRealisationById from '../utils/getCourseUnitRealisationById';

const prefix = 'useCourseUnitRealisation';

const getKey = (id) => {
  return id ? [prefix, id] : null;
};

const getCourseUnitRealisationByIdFetcher = (prefix, id) => {
  return getCourseUnitRealisationById(id);
};

const useCourseUnitRealisation = (id) => {
  const key = getKey(id);

  const { data, ...rest } = useSWR(key, getCourseUnitRealisationByIdFetcher);

  return { courseUnitRealisation: data, ...rest };
};

export default useCourseUnitRealisation;
