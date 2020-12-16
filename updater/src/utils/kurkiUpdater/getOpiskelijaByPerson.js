const getEtunimiByFirstNames = (firstNames) => {
  if (!firstNames) {
    return null;
  }

  if (firstNames.length <= 25) {
    return firstNames;
  }

  const [first] = firstNames.split(' ');

  return first.slice(0, 25);
};

const getOpiskelijaByPerson = (person) => {
  const { firstNames, lastName, primaryEmail, studentNumber, id } = person;

  const etunimi = getEtunimiByFirstNames(firstNames);
  const sukunimi = lastName ? lastName.slice(0, 40) : null;
  const personid = studentNumber;

  return {
    etunimi,
    sukunimi,
    personid,
    opnro: studentNumber,
    hetu: studentNumber,
    sahkopostiosoite: primaryEmail,
    sisId: id,
  };
};

export default getOpiskelijaByPerson;
