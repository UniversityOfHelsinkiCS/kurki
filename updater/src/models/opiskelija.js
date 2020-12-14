import BaseModel from './baseModel';

class Opiskelija extends BaseModel {
  static get idColumn() {
    return 'hetu';
  }

  static get tableName() {
    return 'opiskelija';
  }
}

export default Opiskelija;
