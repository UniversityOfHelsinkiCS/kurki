import opetushallintoClient from './opetushallintoClient';

const createStatusReport = async ({ startDate, endDate }) => {
  const body = { startDate, endDate };

  const { data } = await opetushallintoClient.post(
    `/updater/status-reports`,
    body,
  );

  return data;
};

export default createStatusReport;
