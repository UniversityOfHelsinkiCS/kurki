import BaseModel from './BaseModel';
import knex from '../utils/knex';

export class Opiskelija extends BaseModel {
  static get idColumn() {
    return 'hetu';
  }

  static get tableName() {
    return 'opiskelija';
  }
}

export default Opiskelija.bindKnex(knex);
