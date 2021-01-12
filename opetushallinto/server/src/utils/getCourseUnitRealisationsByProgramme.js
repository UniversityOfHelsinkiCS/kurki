import LRU from 'lru-cache';
import { subMonths, startOfDay } from 'date-fns';
import { sortBy } from 'lodash';

import importerClient from './importerClient';
import callWithCache from './callWithCache';
import Kurssi from '../models/Kurssi';

const cache = new LRU({
  max: 10,
  maxAge: 1000 * 60 * 60,
});

const getCacheKey = ({ programmeCode, activityPeriodEndDateAfter }) => {
  return JSON.stringify([programmeCode, activityPeriodEndDateAfter]);
};

const withKurkiData = async (courseUnitRealisations) => {
  const ids = courseUnitRealisations.map(({ id }) => id);
  const kurssit = await Kurssi.query().whereIn('sisId', ids);

  return courseUnitRealisations.map((c) => ({
    ...c,
    inKurki: Boolean(kurssit.find((k) => k.sisId === c.id)),
  }));
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

  const courseUnitRealisationsWithKurkiData = await withKurkiData(
    courseUnitRealisations,
  );

  const sortedCourseUnitRealisations = sortBy(
    courseUnitRealisationsWithKurkiData,
    (c) => -new Date(c.activityPeriod.endDate),
  );

  return sortedCourseUnitRealisations;
};

export default getCourseUnitRealisationsByProgramme;
