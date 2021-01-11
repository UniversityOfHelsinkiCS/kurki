import BaseModel from './BaseModel';
import knex from '../utils/knex';

class Henkilo extends BaseModel {
  static get idColumn() {
    return 'htunnus';
  }

  static get tableName() {
    return 'henkilo';
  }
}

export default Henkilo.bindKnex(knex);
