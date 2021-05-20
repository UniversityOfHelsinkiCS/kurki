import BaseModel from './baseModel';

class Koe extends BaseModel {
  static get idColumn() {
    return [
      'kurssikoodi',
      'lukukausi',
      'lukuvuosi',
      'tyyppi',
      'kurssiNro',
      'koeNro'
    ];
  }

  static get tableName() {
    return 'koe';
  }
}

export default Koe;
