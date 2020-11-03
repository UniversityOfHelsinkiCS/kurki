import getKtunnusByPerson from './getKtunnusByPerson';

const getHenkiloByPerson = (person) => {
  const { firstNames, lastName, id } = person;

  const ktunnus = getKtunnusByPerson(person);

  return {
    ktunnus,
    etunimet: firstNames,
    sukunimi: lastName,
    sisId: id,
  };
};

export default getHenkiloByPerson;
