import Kurssi from '../../models/Kurssi';
import serializeCourseId from '../serializeCourseId';

const getCourseByKurssi = (kurssi) => {
  const { opintojakso, opintopisteet, kieli } = kurssi;

  const language = kieli ? kieli.getLanguageCode() : null;

  return {
    id: serializeCourseId(kurssi),
    sisId: kurssi.sisId,
    name:
      opintojakso.nimiSuomi ||
      opintojakso.nimiEnglanti ||
      opintojakso.nimiRuotsi,
    code: kurssi.koodi,
    year: kurssi.lukuvuosi,
    term: kurssi.lukukausi,
    type: kurssi.tyyppi,
    number: kurssi.kurssiNro,
    startDate: kurssi.alkamisPvm,
    endDate: kurssi.paattymisPvm,
    finishDate: kurssi.suoritusPvm,
    ownerId: kurssi.omistajaHenkilo.ktunnus,
    credits: opintopisteet,
    language,
  };
};

const getFrozenCourses = async () => {
  const test = await Kurssi.query().findOne({ sisId: 'hy-opt-cur-2021-96f538f3-de9b-4656-894a-f15ee4321b6e' });

  console.log(test);

  const kurssit = await Kurssi.query()
    .where({
      siirto: 'T',
      tila: 'J',
    })
    .withGraphFetched('[omistajaHenkilo,opintojakso,kieli]')
    .orderBy('suoritusPvm');

  return kurssit.map(getCourseByKurssi);
};

export default getFrozenCourses;
