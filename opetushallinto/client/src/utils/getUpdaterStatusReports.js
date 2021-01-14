import apiClient from './apiClient';

const getUpdaterStatusReports = async () => {
  const { data } = await apiClient.get(`/updater/status-reports`);

  return data;
};

export default getUpdaterStatusReports;
