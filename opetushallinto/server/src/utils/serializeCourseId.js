const serializeCourseId = (kurssi) => {
  return [
    kurssi.kurssikoodi,
    kurssi.lukukausi,
    kurssi.lukuvuosi,
    kurssi.tyyppi,
    kurssi.kurssiNro,
  ].join('.');
};

export default serializeCourseId;
