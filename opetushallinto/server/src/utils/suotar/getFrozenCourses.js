import Kurssi from '../../models/Kurssi';
import serializeCourseId from '../serializeCourseId';

const getCourseByKurssi = (kurssi) => {
  return {
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
    ownerId: kurssi.omistajaHenkilo.ktunnus,
  }
}

const getFrozenCourses = async () => {
  const kurssit = await Kurssi.query()
    .where({
      siirto: 'T',
      tila: 'J',
    })
    .withGraphFetched('omistajaHenkilo')
    .orderBy('suoritusPvm');

  return kurssit.map(getCourseByKurssi);
};

export default getFrozenCourses;
