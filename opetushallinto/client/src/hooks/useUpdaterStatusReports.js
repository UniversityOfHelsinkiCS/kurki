import useSWR from 'swr';

import getUpdaterStatusReports from '../utils/getUpdaterStatusReports';

const prefix = 'useUpdaterStatusReports';

const getKey = () => {
  return [prefix];
};

const getUpdaterStatusReportsFetcher = () => {
  return getUpdaterStatusReports();
};

const useUpdaterStatusReports = () => {
  const key = getKey();

  const { data, ...rest } = useSWR(key, getUpdaterStatusReportsFetcher);

  return { statusReports: data, ...rest };
};

export default useUpdaterStatusReports;
