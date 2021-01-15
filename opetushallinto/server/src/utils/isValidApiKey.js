import { API_KEY } from '../config';

const isValidApiKey = (apiKey) => {
  if (!API_KEY) {
    return false;
  }

  return API_KEY === apiKey;
};

export default isValidApiKey;
