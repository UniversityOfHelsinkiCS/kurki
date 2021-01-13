import BaseModel from './BaseModel';
import knex from '../utils/knex';
import { Opiskelija } from './Opiskelija';
import { Kielikoodi } from './Kielikoodi';

export class Osallistuminen extends BaseModel {
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

  static get modifiers() {
    return {
      frozen(builder) {
        return builder.where('siirto', 'T');
      },
    };
  }

  static get tableName() {
    return 'osallistuminen';
  }

  static get relationMappings() {
    return {
      opiskelija: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Opiskelija,
        join: {
          from: 'osallistuminen.hetu',
          to: 'opiskelija.hetu',
        },
      },
      kieli: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Kielikoodi,
        join: {
          from: 'osallistuminen.kielikoodi',
          to: 'kielikoodi.kielikoodi',
        },
      },
    };
  }
}

export default Osallistuminen.bindKnex(knex);
