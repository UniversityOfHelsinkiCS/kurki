import BaseModel from './BaseModel';
import knex from '../utils/knex';

export class Opintojakso extends BaseModel {
  static get idColumn() {
    return 'kurssikoodi';
  }

  static get tableName() {
    return 'opintojakso';
  }
}

export default Opintojakso.bindKnex(knex);
