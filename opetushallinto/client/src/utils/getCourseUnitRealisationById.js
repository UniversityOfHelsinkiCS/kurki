import apiClient from './apiClient';

const getCourseUnitRealisationById = async (id) => {
  const { data } = await apiClient.get(`/course-unit-realisations/${id}`);

  return data;
};

export default getCourseUnitRealisationById;
