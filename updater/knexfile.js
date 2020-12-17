require('dotenv').config();

const { knexSnakeCaseMappers } = require('objection');

const {
  KURKI_DB_USER,
  KURKI_DB_PASSWORD,
  KURKI_DB_CONNECTION_STRING,
} = process.env;

module.exports = {
  debug: process.env.DEBUG,
  client: 'oracledb',
  connection: {
    user: KURKI_DB_USER,
    password: KURKI_DB_PASSWORD,
    connectString: KURKI_DB_CONNECTION_STRING,
  },
  ...knexSnakeCaseMappers({ upperCase: true }),
};
