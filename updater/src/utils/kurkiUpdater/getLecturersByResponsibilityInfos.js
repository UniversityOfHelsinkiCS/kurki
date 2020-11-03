const getLecturersByResponsibilityInfos = (responsibilityInfos) => {
  const persons = responsibilityInfos
    ? responsibilityInfos.map(({ person }) => person)
    : [];

  return persons;
};

export default getLecturersByResponsibilityInfos;
