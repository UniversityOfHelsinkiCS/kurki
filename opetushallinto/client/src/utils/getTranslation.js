const getTranslation = (obj, language = 'fi') => {
  if (!obj) {
    return undefined;
  }

  const priority = [language, 'fi', 'en', 'sv'];

  for (const priorityLanguage of priority) {
    if (obj[priorityLanguage] !== undefined) {
      return obj[priorityLanguage];
    }
  }

  return undefined;
};

export default getTranslation;
