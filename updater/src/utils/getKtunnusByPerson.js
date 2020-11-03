import { isString } from 'lodash';

const getKtunnusByPerson = person => {
  const { eduPersonPrincipalName } = person;
  
  if (!isString(eduPersonPrincipalName)) {
    return undefined;
  }

  const [adAccount,] = eduPersonPrincipalName.split('@');

  return adAccount;
};

export default getKtunnusByPerson;
