const getHtunnusByFullName = ({ firstName, lastName } = {}) => {
  if (!firstName || !lastName) {
    return undefined;
  }

  const lastNamePart = lastName.substring(0, 10).toUpperCase();
  const firstNamePart = firstName.substring(0, 1).toUpperCase();

  return `${lastNamePart}_${firstNamePart}`;
};

export default getHtunnusByFullName;
