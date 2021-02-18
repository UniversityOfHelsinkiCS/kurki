import Kurssi from '../../models/Kurssi';
import serializeCourseId from '../serializeCourseId';
import parseCourseId from '../parseCourseId';

const langugageByKielikoodi = {
  S: 'fi',
  R: 'sv',
  E: 'en',
};

const getParticipantByOsallistuminen = (osallistuminen, kurssi) => {
  const { opiskelija, kieli } = osallistuminen;
  const kielikoodi = kieli ? kieli.kielikoodi : null;

  const language = kielikoodi
    ? langugageByKielikoodi[kielikoodi] || null
    : null;

  return {
    studentNumber: osallistuminen.hetu,
    studentSisId: opiskelija ? opiskelija.sisId : null,
    studentCredits: osallistuminen.laajuusOp,
    language,
    courseId: serializeCourseId(kurssi),
    courseSisId: kurssi.sisId,
    courseCode: kurssi.kurssikoodi,
    courseYear: kurssi.year,
    courseName: kurssi.nimi,
    courseFinishDate: kurssi.suoritusPvm,
    courseWeeks: kurssi.opintoviikot,
    courseCredits: kurssi.laajuusOp,
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
      '[osallistumiset(frozen).[opiskelija,kieli],omistajaHenkilo]',
    );

  const osallistumiset = kurssi ? kurssi.osallistumiset || [] : [];

  return osallistumiset.map((osallistuminen) =>
    getParticipantByOsallistuminen(osallistuminen, kurssi),
  );
};

export default getFrozenParticipantsByCourseId;
