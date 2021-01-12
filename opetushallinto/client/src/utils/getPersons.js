import apiClient from './apiClient';

const getPersons = async () => {
  const { data } = await apiClient.get(`/persons`);

  return data;
};

export default getPersons;
