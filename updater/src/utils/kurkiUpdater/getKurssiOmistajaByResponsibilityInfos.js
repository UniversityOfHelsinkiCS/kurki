import { get } from 'lodash';

const getKurssiOmistajaByResponsibilityInfos = (responsibilityInfos) => {
  return get(responsibilityInfos, '[0].person');
};

export default getKurssiOmistajaByResponsibilityInfos;
