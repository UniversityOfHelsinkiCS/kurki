import Henkilo from '../models/Henkilo';

const getPersons = async () => {
  const henkilot = await Henkilo.query();

  return henkilot.map((h) => ({
    id: h.htunnus,
    firstNames: h.etunimet,
    lastName: h.sukunimi,
  }));
};

export default getPersons;
