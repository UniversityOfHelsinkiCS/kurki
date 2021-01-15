import Kurssi from '../models/Kurssi';
import serializeCourseId from './serializeCourseId';

const getCourseByKurssi = (kurssi) => ({
  id: serializeCourseId(kurssi),
  sisId: kurssi.sisId,
  name: kurssi.nimi,
  code: kurssi.koodi,
  year: kurssi.lukuvuosi,
  term: kurssi.lukukausi,
  type: kurssi.tyyppi,
  number: kurssi.kurssiNro,
  startDate: kurssi.alkamisPvm,
  endDate: kurssi.paattymisPvm,
  finishDate: kurssi.suoritusPvm,
  ownerId: kurssi.omistaja,
});

const getFrozenCourses = async () => {
  const kurssit = await Kurssi.query()
    .where({
      siirto: 'T',
      tila: 'J',
    })
    .orderBy('suoritusPvm');

  return kurssit.map(getCourseByKurssi);
};

export default getFrozenCourses;
