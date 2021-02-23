import BaseModel from './BaseModel';

export class Opintojakso extends BaseModel {
  static get idColumn() {
    return 'kurssikoodi';
  }

  static get tableName() {
    return 'opintojakso';
  }
}

export default Opintojakso;
