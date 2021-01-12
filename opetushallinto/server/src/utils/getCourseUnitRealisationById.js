import uniqBy from 'lodash/uniqBy';

import importerClient from './importerClient';
import Kurssi from '../models/Kurssi';

const getPersonByHenkilo = (henkilo) => {
  return {
    id: henkilo.htunnus,
    firstNames: henkilo.etunimet || null,
    lastName: henkilo.sukunimi || null,
  };
};

const withKurkiData = async (courseUnitRealisation) => {
  const kurssi = await Kurssi.query()
    .findOne({
      sisId: courseUnitRealisation.id,
    })
    .withGraphFetched('[omistajaHenkilo,opetustehtavanHoidot.henkilo]');

  const kurkiOwner =
    kurssi && kurssi.omistajaHenkilo
      ? getPersonByHenkilo(kurssi.omistajaHenkilo)
      : null;

  const kurkiTeachers =
    kurssi && kurssi.opetustehtavanHoidot
      ? kurssi.opetustehtavanHoidot.map(({ henkilo }) =>
          getPersonByHenkilo(henkilo),
        )
      : [];

  return {
    ...courseUnitRealisation,
    inKurki: Boolean(kurssi),
    kurkiOwner,
    kurkiTeachers: uniqBy(kurkiTeachers, ({ id }) => id),
  };
};

const getCourseUnitRealisationById = async (id) => {
  const { data: courseUnitRealisation } = await importerClient.get(
    `/course_unit_realisations/${id}`,
  );

  const courseUnitRealisationWithKurkiData = await withKurkiData(
    courseUnitRealisation,
  );

  return courseUnitRealisationWithKurkiData;
};

export default getCourseUnitRealisationById;
