import { isString } from 'lodash';

import { UserInputError } from '../errors';

const parseCourseId = (id) => {
  if (!isString(id)) {
    throw new UserInputError('Invalid course id');
  }

  const parts = id.split('.');
  const [code, term, year, type, number] = parts;

  if (!code || !term || !year || !type || !number) {
    throw new UserInputError('Invalid course id');
  }

  const parsedYear = parseInt(year);
  const parsedNumber = parseInt(number);

  if (isNaN(parsedYear) || isNaN(parsedNumber)) {
    throw new UserInputError('Invalid course id');
  }

  return { code, term, year: parsedYear, type, number: parsedNumber };
};

export default parseCourseId;
