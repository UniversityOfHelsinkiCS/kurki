import BaseModel from './baseModel';

class Osallistuminen extends BaseModel {
  static get idColumn() {
    return [
      'kurssikoodi',
      'lukukausi',
      'lukuvuosi',
      'tyyppi',
      'kurssiNro',
      'ryhmaNro',
      'hetu',
    ];
  }

  static get tableName() {
    return 'osallistuminen';
  }
}

export default Osallistuminen;
