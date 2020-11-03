import BaseModel from './baseModel';

class KurssinTila extends BaseModel {
  static get idColumn() {
    return 'tila';
  }

  static get tableName() {
    return 'kurssin_tila';
  }
}

export default KurssinTila;
