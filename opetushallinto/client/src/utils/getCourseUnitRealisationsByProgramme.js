import apiClient from './apiClient';

const getCourseUnitRealisationsByProgramme = async (programmeCode) => {
  const { data } = await apiClient.get(
    `/course-unit-realisations/programme/${programmeCode}`,
  );

  return data;
};

export default getCourseUnitRealisationsByProgramme;
