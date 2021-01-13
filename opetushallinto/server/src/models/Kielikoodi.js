import BaseModel from './BaseModel';
import knex from '../utils/knex';

export class Kielikoodi extends BaseModel {
  static get idColumn() {
    return 'kielikoodi';
  }

  static get tableName() {
    return 'kielikoodi';
  }
}

export default Kielikoodi.bindKnex(knex);
