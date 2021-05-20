import BaseModel, { QueryBuilder } from './baseModel';
import { transaction } from 'objection';

class EnhancedQueryBuilder extends QueryBuilder {
  async findForTerm(lukuvuosi, lukukausi) {
    return transaction(this.modelClass(), async (Model) => {
      const koetilaisuusNro = 1 + Math.max(...(await this.select('koetilaisuusNro').from('koetilaisuus')).map(k => k.koetilaisuusNro))

      const event = await this.findOne({ lukuvuosi, lukukausi })
      if (event) {
        return event;
      }

      return await Model.query().insert({ lukuvuosi, lukukausi, koetilaisuusNro });
    });
  }
}

class Koetilaisuus extends BaseModel {
  static get QueryBuilder() {
    return EnhancedQueryBuilder;
  }

  static get idColumn() {
    return [
      'lukukausi',
      'lukuvuosi',
      'koetilaisuusNro'
    ];
  }

  static get tableName() {
    return 'koetilaisuus';
  }
}

export default Koetilaisuus;
