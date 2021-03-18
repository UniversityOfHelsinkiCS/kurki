import Kurssi from '../models/Kurssi';

const courseUnitRealisationArrayWithKurkiFields = async (
  courseUnitRealisations,
) => {
  const ids = courseUnitRealisations.map(({ id }) => id);
  const kurssit = await Kurssi.query().whereIn('sisId', ids);

  return courseUnitRealisations.map((c) => {
    const kurssi = kurssit.find((k) => k.sisId === c.id);

    return {
      ...c,
      inKurki: Boolean(kurssi),
      kurkiData: kurssi,
    };
  });
};

export default courseUnitRealisationArrayWithKurkiFields;
