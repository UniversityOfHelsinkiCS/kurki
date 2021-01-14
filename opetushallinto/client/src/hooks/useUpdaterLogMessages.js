import useSWR from 'swr';

import getUpdaterLogMessages from '../utils/getUpdaterLogMessages';

const prefix = 'useUpdaterLogMessages';

const getKey = () => {
  return [prefix];
};

const getUpdaterLogMessagesFetcher = () => {
  return getUpdaterLogMessages();
};

const useUpdaterLogMessages = () => {
  const key = getKey();

  const { data, ...rest } = useSWR(key, getUpdaterLogMessagesFetcher);

  return { logMessages: data, ...rest };
};

export default useUpdaterLogMessages;
