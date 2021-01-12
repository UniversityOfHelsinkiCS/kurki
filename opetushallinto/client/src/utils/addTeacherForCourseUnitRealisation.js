import apiClient from './apiClient';

const addTeacherForCouseUnitRealisation = async ({
  courseUnitRealisationId,
  personId,
}) => {
  const {
    data,
  } = await apiClient.post(
    `/course-unit-realisations/${courseUnitRealisationId}/teachers`,
    { personId },
  );

  return data;
};

export default addTeacherForCouseUnitRealisation;
