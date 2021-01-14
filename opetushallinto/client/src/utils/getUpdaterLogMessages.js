import apiClient from './apiClient';

const getUpdaterLogMessages = async () => {
  const { data } = await apiClient.get(`/updater/logs`);

  return data;
};

export default getUpdaterLogMessages;
