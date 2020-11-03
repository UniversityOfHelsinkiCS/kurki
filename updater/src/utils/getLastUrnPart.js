import { isString } from 'lodash';

const getLastUrnPart = (urn) => {
  if (!isString(urn)) {
    return undefined;
  }

  const parts = urn.split(':');

  return parts[parts.length - 1];
};

export default getLastUrnPart;
