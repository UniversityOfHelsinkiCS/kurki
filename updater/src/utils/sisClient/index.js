import axios from 'axios';
import https from 'https';

import SisClient from './sisClient';
import SisImporterClient from './sisImporterClient';
import { SIS_IMPORTER_API_TOKEN, SIS_IMPORTER_API_URL } from '../../config';

const importerHttpClient = axios.create({
  baseURL: SIS_IMPORTER_API_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const importerClient = new SisImporterClient({
  httpClient: importerHttpClient,
  token: SIS_IMPORTER_API_TOKEN,
});

const sisClient = new SisClient({
  importerClient,
});

export default sisClient;
