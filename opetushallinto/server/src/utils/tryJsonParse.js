const tryJsonParse = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
};

export default tryJsonParse;
