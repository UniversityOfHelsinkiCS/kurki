import apiClient from './apiClient';

const addResponsiblePersonForCouseUnitRealisation = async (
  courseUnitRealisationId,
  personId,
) => {
  const {
    data,
  } = await apiClient.post(
    `/course-unit-realisations/${courseUnitRealisationId}/responsible-persons`,
    { personId },
  );

  return data;
};

export default addResponsiblePersonForCouseUnitRealisation;
