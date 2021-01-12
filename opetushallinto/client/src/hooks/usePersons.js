import useSWR from 'swr';

import getPersons from '../utils/getPersons';

const prefix = 'usePersons';

const getKey = () => {
  return [prefix];
};

const getPersonsFetcher = () => {
  return getPersons();
};

const usePersons = () => {
  const key = getKey();

  const { data, ...rest } = useSWR(key, getPersonsFetcher);

  return { persons: data, ...rest };
};

export default usePersons;
