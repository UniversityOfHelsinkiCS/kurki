import BaseModel from './BaseModel';
import knex from '../utils/knex';
import { Henkilo } from './Henkilo';
import { OpetustehtavanHoito } from './OpetustehtavanHoito';
import { Osallistuminen } from './Osallistuminen';

export class Kurssi extends BaseModel {
  static get idColumn() {
    return ['kurssikoodi', 'lukukausi', 'lukuvuosi', 'tyyppi', 'kurssiNro'];
  }

  static get tableName() {
    return 'kurssi';
  }

  static get relationMappings() {
    return {
      omistajaHenkilo: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Henkilo,
        join: {
          from: 'kurssi.omistaja',
          to: 'henkilo.htunnus',
        },
      },
      osallistumiset: {
        relation: BaseModel.HasManyRelation,
        modelClass: Osallistuminen,
        join: {
          from: [
            'kurssi.kurssikoodi',
            'kurssi.lukukausi',
            'kurssi.lukuvuosi',
            'kurssi.tyyppi',
            'kurssi.kurssiNro',
          ],
          to: [
            'osallistuminen.kurssikoodi',
            'osallistuminen.lukukausi',
            'osallistuminen.lukuvuosi',
            'osallistuminen.tyyppi',
            'osallistuminen.kurssiNro',
          ],
        },
      },
      opetustehtavanHoidot: {
        relation: BaseModel.HasManyRelation,
        modelClass: OpetustehtavanHoito,
        join: {
          from: [
            'kurssi.kurssikoodi',
            'kurssi.lukukausi',
            'kurssi.lukuvuosi',
            'kurssi.tyyppi',
            'kurssi.kurssiNro',
          ],
          to: [
            'opetustehtavan_hoito.kurssikoodi',
            'opetustehtavan_hoito.lukukausi',
            'opetustehtavan_hoito.lukuvuosi',
            'opetustehtavan_hoito.tyyppi',
            'opetustehtavan_hoito.kurssiNro',
          ],
        },
      },
    };
  }
}

export default Kurssi.bindKnex(knex);
