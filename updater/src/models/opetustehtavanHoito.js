import BaseModel from './baseModel';

class OpetustehtavanHoito extends BaseModel {
  static get idColumn() {
    return [
      'kurssikoodi',
      'lukukausi',
      'lukuvuosi',
      'tyyppi',
      'kurssiNro',
      'ryhmaNro',
      'htunnus',
      'opetustehtava',
    ];
  }

  static get tableName() {
    return 'opetustehtavan_hoito';
  }
}

export default OpetustehtavanHoito;
