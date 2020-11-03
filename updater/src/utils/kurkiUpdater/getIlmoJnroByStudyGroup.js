import { get, isNumber } from 'lodash';

const group99RegExp = /(Group 99|Jono|Ryhmä 99)/i;

const getIlmoJnroByStudyGroup = (group) => {
  const name = get(group, 'name.fi');

  if (!name) {
    return undefined;
  }

  if (group99RegExp.test(name)) {
    return 99;
  }

  const numberMatch = name.match(/^(\D*)(\d+)/);

  const maybeNumber =
    numberMatch && numberMatch[2] ? parseInt(numberMatch[2]) : undefined;

  return isNumber(maybeNumber) && maybeNumber < 100 ? maybeNumber : undefined;
};

export default getIlmoJnroByStudyGroup;
