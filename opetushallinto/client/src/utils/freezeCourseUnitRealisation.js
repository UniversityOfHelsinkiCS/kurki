import apiClient from './apiClient';

const freezeCourseUnitRealisation = async (courseUnitRealisationId) => {
  const { data } = await apiClient.post(
    `/course-unit-realisations/${courseUnitRealisationId}/freeze`,
  );

  return data;
};

export default freezeCourseUnitRealisation;
