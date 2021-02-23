import BaseModel from './BaseModel';
import knex from '../utils/knex';

const languageCodeByKielikoodi = {
  S: 'fi',
  R: 'sv',
  E: 'en',
};

export class Kielikoodi extends BaseModel {
  static get idColumn() {
    return 'kielikoodi';
  }

  static get tableName() {
    return 'kielikoodi';
  }

  getLanguageCode() {
    return languageCodeByKielikoodi[this.kielikoodi] || null
  }
}

export default Kielikoodi.bindKnex(knex);
