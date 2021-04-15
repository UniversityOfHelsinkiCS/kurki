import { uniqBy } from 'lodash';

import Kurssi from '../models/Kurssi';

const getPersonByHenkilo = (henkilo) => {
  return {
    id: henkilo.htunnus,
    firstNames: henkilo.etunimet || null,
    lastName: henkilo.sukunimi || null,
  };
};

const courseUnitRealisationWithKurkiFields = async (courseUnitRealisation) => {
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
    kurkiData: kurssi,
  };
};

export default courseUnitRealisationWithKurkiFields;
