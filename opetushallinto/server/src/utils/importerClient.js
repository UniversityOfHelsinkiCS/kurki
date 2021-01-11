import axios from 'axios';

import { IMPORTER_API_URL, IMPORTER_API_TOKEN } from '../config';

const importerClient = axios.create({
  baseURL: IMPORTER_API_URL,
  params: {
    token: IMPORTER_API_TOKEN,
  },
});

export default importerClient;
