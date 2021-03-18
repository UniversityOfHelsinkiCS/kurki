import { get } from 'lodash';

const getOpintojaksoByCourseUnit = (courseUnit) => {
  const { code, name, credits } = courseUnit;

  return {
    kurssikoodi: code,
    nimiSuomi: get(name, 'fi') || null,
    nimiRuotsi: get(name, 'sv') || null,
    nimiEnglanti: get(name, 'en') || null,
    opintopisteet: get(credits, 'min') || null,
    opintopisteetYlaraja: get(credits, 'max') || null,
  };
};

export default getOpintojaksoByCourseUnit;
