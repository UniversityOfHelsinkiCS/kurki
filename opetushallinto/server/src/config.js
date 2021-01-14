import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { knexSnakeCaseMappers } from 'objection';

const { env } = process;

export const PORT = env.PORT || 5000;

export const IS_PRODUCTION = env.NODE_ENV === 'production';

export const IMPORTER_API_URL =
  env.IMPORTER_API_URL || 'https://importer.cs.helsinki.fi';

export const IMPORTER_API_TOKEN = env.IMPORTER_API_TOKEN;

export const KURKI_KNEX_CONFIG = {
  client: 'oracledb',
  connection: {
    user: env.KURKI_DB_USER,
    password: env.KURKI_DB_PASSWORD,
    connectString: env.KURKI_DB_CONNECTION_STRING,
  },
  ...knexSnakeCaseMappers({ upperCase: true }),
};

export const REDIS_URI = env.REDIS_URI;

export const UPDATER_LOGS_KEY = 'updater_logs';

export const UPDATER_LOGS_MAX_SIZE = 100;

export const UPDATER_STATUS_REPORTS_KEY = 'updater_status_reports';

export const UPDATER_STATUS_REPORTS_MAX_SIZE = 10;
