import { get } from 'lodash';

const getOpintojaksoByCourseUnit = (courseUnit) => {
  const { code, name } = courseUnit;

  return {
    kurssikoodi: code,
    nimiSuomi: get(name, 'fi') || null,
    nimiRuotsi: get(name, 'sv') || null,
    nimiEnglanti: get(name, 'en') || null,
  };
};

export default getOpintojaksoByCourseUnit;
