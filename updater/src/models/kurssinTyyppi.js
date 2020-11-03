import BaseModel from './baseModel';

class KurssinTyyppi extends BaseModel {
  static get idColumn() {
    return 'tyyppi';
  }

  static get tableName() {
    return 'kurssin_tyyppi';
  }
}

export default KurssinTyyppi;
