import LRU from 'lru-cache';
import { subMonths, startOfDay } from 'date-fns';
import { sortBy } from 'lodash';

import importerClient from './importerClient';
import callWithCache from './callWithCache';

const cache = new LRU({
  max: 10,
  maxAge: 1000 * 60 * 60,
});

const getCacheKey = ({ programmeCode, activityPeriodEndDateAfter }) => {
  return JSON.stringify([programmeCode, activityPeriodEndDateAfter]);
};

const getCourseUnitRealisationsByProgramme = async (
  programmeCode,
  options = {},
) => {
  const activityPeriodEndDateAfter =
    options.activityPeriodEndDateAfter || startOfDay(subMonths(new Date(), 12));

  const params = {
    activityPeriodEndDateAfter: activityPeriodEndDateAfter.toISOString(),
  };

  const cacheKey = getCacheKey({ programmeCode, activityPeriodEndDateAfter });

  const { data: courseUnitRealisations } = await callWithCache(
    cache,
    cacheKey,
    () => {
      return importerClient.get(
        `/kurki/course_unit_realisations/programme/${programmeCode}`,
        { params },
      );
    },
  );

  const sortedCourseUnitRealisations = sortBy(
    courseUnitRealisations,
    (c) => -new Date(c.activityPeriod.endDate),
  );

  return sortedCourseUnitRealisations;
};

export default getCourseUnitRealisationsByProgramme;
