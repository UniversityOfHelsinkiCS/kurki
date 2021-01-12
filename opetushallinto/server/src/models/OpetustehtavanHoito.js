import BaseModel from './BaseModel';
import knex from '../utils/knex';
import { Henkilo } from './Henkilo';

export class OpetustehtavanHoito extends BaseModel {
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

  static get relationMappings() {
    return {
      henkilo: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Henkilo,
        join: {
          from: 'opetustehtavan_hoito.htunnus',
          to: 'henkilo.htunnus',
        },
      },
    };
  }
}

export default OpetustehtavanHoito.bindKnex(knex);
