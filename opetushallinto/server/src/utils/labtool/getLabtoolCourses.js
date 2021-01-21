import Kurssi from '../../models/Kurssi';
import serializeCourseId from '../serializeCourseId';

const CODES = ['TKT20011', 'TKT20010', 'TKT20002'];

const getLabtoolCourses = async ({ year, term }) => {
  const kurssit = await Kurssi.query()
    .where({
      lukuvuosi: year,
      lukukausi: term,
    })
    .andWhere((builder) => builder.whereIn('kurssikoodi', CODES));

  const courses = kurssit.map((kurssi) => ({
    id: serializeCourseId(kurssi),
    name: kurssi.nimi,
    starts: kurssi.alkamisPvm,
    ends: kurssi.paattymisPvm,
  }));

  return courses;
};

export default getLabtoolCourses;
