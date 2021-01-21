const serializeCourseId = (kurssi) => {
  return [
    kurssi.kurssikoodi,
    kurssi.lukuvuosi,
    kurssi.lukukausi,
    kurssi.tyyppi,
    kurssi.kurssiNro,
  ].join('.');
};

export default serializeCourseId;
