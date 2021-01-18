import dotenv from 'dotenv';

dotenv.config();

import knexfile from '../knexfile';

export const {
  SIS_IMPORTER_API_TOKEN,
  SIS_IMPORTER_API_URL,
  KURKI_FALLBACK_KURSSI_OMISTAJA,
  OPETUSHALLINTO_URL,
} = process.env;

export const DB_CONFIG = knexfile;

export const CS_BACHELOR_PROGRAMME_CODE = '500-K005';

export const COURSES_UPDATE_CRON = '0 */3 * * *';

export const OPETUSHALLINTO_API_KEY = process.env.OPETUSHALLINTO_API_KEY;

export const SEND_REPORTS = process.env.SEND_REPORTS === 'false' ? false : true;
