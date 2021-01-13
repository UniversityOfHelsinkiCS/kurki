import importerClient from './importerClient';

const getCourseUnitRealisationById = async (id) => {
  const { data: courseUnitRealisation } = await importerClient.get(
    `/course_unit_realisations/${id}`,
  );

  return courseUnitRealisation;
};

export default getCourseUnitRealisationById;
