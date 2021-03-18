import Kurssi from '../../models/Kurssi';
import serializeCourseId from '../serializeCourseId';
import parseCourseId from '../parseCourseId';

const getParticipantByOsallistuminen = (osallistuminen, kurssi) => {
  const { opiskelija, kieli } = osallistuminen;

  const language = kieli ? kieli.getLanguageCode() : null;

  const { opintojakso } = kurssi;

  return {
    studentNumber: osallistuminen.hetu,
    studentSisId: opiskelija ? opiskelija.sisId : null,
    studentCredits: osallistuminen.laajuusOp,
    language,
    courseId: serializeCourseId(kurssi),
    courseSisId: kurssi.sisId,
    courseCode: kurssi.kurssikoodi,
    courseYear: kurssi.year,
    courseName:
      opintojakso.nimiSuomi ||
      opintojakso.nimiEnglanti ||
      opintojakso.nimiRuotsi,
    courseFinishDate: kurssi.suoritusPvm,
    courseWeeks: kurssi.opintoviikot,
    courseCredits: kurssi.opintopisteet,
    courseNumber: kurssi.kurssiNro,
    courseType: kurssi.tyyppi,
    courseSemester: kurssi.lukukausi,
    grade: osallistuminen.arvosana,
    graderId: kurssi.omistajaHenkilo.ktunnus,
  };
};

const getFrozenParticipantsByCourseId = async (courseId) => {
  const { code, term, year, type, number } = parseCourseId(courseId);

  const kurssi = await Kurssi.query()
    .findOne({
      kurssikoodi: code,
      lukuvuosi: year,
      lukukausi: term,
      tyyppi: type,
      kurssiNro: number,
    })
    .withGraphFetched(
      '[osallistumiset(frozen).[opiskelija,kieli],omistajaHenkilo,opintojakso]',
    );

  const osallistumiset = kurssi ? kurssi.osallistumiset || [] : [];

  return osallistumiset.map((osallistuminen) =>
    getParticipantByOsallistuminen(osallistuminen, kurssi),
  );
};

export default getFrozenParticipantsByCourseId;
