import BaseModel from './baseModel';

class Osallistuminen extends BaseModel {
  static get idColumn() {
    return 'hetu';
  }

  static get tableName() {
    return 'osallistuminen';
  }
}

export default Osallistuminen;
