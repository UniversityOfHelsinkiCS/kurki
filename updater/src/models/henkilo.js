import { transaction } from 'objection';

import BaseModel, { QueryBuilder } from './baseModel';
import getKtunnusByPerson from '../utils/getKtunnusByPerson';
import getHenkiloByPerson from '../utils/getHenkiloByPerson';

class EnhancedQueryBuilder extends QueryBuilder {
  async findOneByPerson(person) {
    const ktunnus = getKtunnusByPerson(person);

    return ktunnus ? this.findOne({ ktunnus }) : null;
  }

  async patchOrInsertByPerson(person) {
    return transaction(this.modelClass(), async (Model) => {
      const { id: sisId } = person;
      const henkilo = getHenkiloByPerson(person);
      const { ktunnus } = henkilo;

      if (!ktunnus) {
        throw new Error(`Could not resolve ktunnus from sis person ${sisId}`);
      }

      const nrUpdated = await Model.query().findOne({ ktunnus }).patch(henkilo);

      if (nrUpdated >= 1) {
        return true;
      } else {
        await Model.query().insert({
          ...henkilo,
          htunnus: ktunnus.substring(0, 12),
        });

        return false;
      }
    });
  }

  async patchOrInsertAndFetchByPerson(person) {
    await this.patchOrInsertByPerson(person);

    return this.findOne({ sisId: person.id });
  }
}

class Henkilo extends BaseModel {
  static get QueryBuilder() {
    return EnhancedQueryBuilder;
  }

  static get idColumn() {
    return 'htunnus';
  }

  static get tableName() {
    return 'henkilo';
  }
}

export default Henkilo;
