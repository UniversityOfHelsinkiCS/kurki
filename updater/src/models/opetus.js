import BaseModel from './baseModel';

class Opetus extends BaseModel {
  static get idColumn() {
    return [
      'kurssikoodi',
      'lukukausi',
      'lukuvuosi',
      'tyyppi',
      'kurssiNro',
      'ryhmaNro',
    ];
  }

  static get tableName() {
    return 'opetus';
  }
}

export default Opetus;
