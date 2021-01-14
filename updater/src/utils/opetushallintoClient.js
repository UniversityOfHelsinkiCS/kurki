import axios from 'axios';

import { OPETUSHALLINTO_URL, OPETUSHALLINTO_API_KEY } from '../config';

const opetushallintoClient = axios.create({
  baseURL: OPETUSHALLINTO_URL,
  headers: {
    'x-api-key': OPETUSHALLINTO_API_KEY,
  },
});

export default opetushallintoClient;
