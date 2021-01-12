import Kurssi from '../models/Kurssi';
import Henkilo from '../models/Henkilo';
import OpetustehtavanHoito from '../models/OpetustehtavanHoito';
import { NotFoundError } from '../errors';

const addResponsiblePersonForCourseUnitRealisation = async ({
  courseUnitRealisationId,
  personId,
}) => {
  const [kurssi, henkilo] = await Promise.all([
    Kurssi.query().findOne({ sisId: courseUnitRealisationId }),
    Henkilo.query().findById(personId),
  ]);

  if (!kurssi) {
    throw new NotFoundError(
      `Course unit realisation ${courseUnitRealisationId} is not in Kurki`,
    );
  }

  if (!henkilo) {
    throw new NotFoundError(`Person ${personId} is not in Kurki`);
  }

  const { kurssikoodi, lukukausi, lukuvuosi, tyyppi, kurssiNro } = kurssi;

  const opetustehtavanHoitoPayload = {
    kurssikoodi,
    lukukausi,
    lukuvuosi,
    tyyppi,
    kurssiNro,
    ryhmaNro: 0,
    htunnus: personId,
    opetustehtava: 'LU',
  };

  const opetustehtavanHoito = await OpetustehtavanHoito.query().insert(
    opetustehtavanHoitoPayload,
  );

  return opetustehtavanHoito;
};

export default addResponsiblePersonForCourseUnitRealisation;
