import BaseModel from './BaseModel';
import knex from '../utils/knex';

class Kurssi extends BaseModel {
  static get idColumn() {
    return ['kurssikoodi', 'lukukausi', 'lukuvuosi', 'tyyppi', 'kurssiNro'];
  }

  static get tableName() {
    return 'kurssi';
  }
}

export default Kurssi.bindKnex(knex);
