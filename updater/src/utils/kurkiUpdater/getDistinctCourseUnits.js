import { groupBy, mapValues, values, maxBy } from 'lodash';

const getDistinctCourseUnits = (courseUnits) => {
  const groupedCourseUnits = groupBy(courseUnits, ({ code }) => code);

  const groupedUniqueCourseUnits = mapValues(
    groupedCourseUnits,
    (courseUnitsByCode) =>
      maxBy(courseUnitsByCode, ({ validityPeriod }) =>
        validityPeriod && validityPeriod.endDate
          ? new Date(validityPeriod.endDate)
          : new Date(0),
      ),
  );

  return values(groupedUniqueCourseUnits);
};

export default getDistinctCourseUnits;
