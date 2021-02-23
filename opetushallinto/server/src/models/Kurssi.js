import BaseModel from './BaseModel';
import knex from '../utils/knex';
import { Henkilo } from './Henkilo';
import { OpetustehtavanHoito } from './OpetustehtavanHoito';
import { Osallistuminen } from './Osallistuminen';
import { Opintojakso } from './Opintojakso';
import { Kielikoodi } from './Kielikoodi';

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
      opintojakso: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Opintojakso,
        join: {
          from: 'kurssi.kurssikoodi',
          to: 'opintojakso.kurssikoodi',
        },
      },
      kieli: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Kielikoodi,
        join: {
          from: 'kurssi.kielikoodi',
          to: 'kielikoodi.kielikoodi',
        },
      },
    };
  }
}

export default Kurssi.bindKnex(knex);
