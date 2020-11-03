import {
  Model,
  QueryBuilder as ObjectionQueryBuilder,
  transaction,
} from 'objection';

export class QueryBuilder extends ObjectionQueryBuilder {
  patchOrInsertById(id, data) {
    return transaction(this.modelClass(), async (Model) => {
      const nrUpdated = await Model.query().findById(id).patch(data);

      if (nrUpdated === 1) {
        return true;
      } else {
        await Model.query().insert(data);

        return false;
      }
    });
  }

  findBySisId(id) {
    return this.findOne({ sisId: id });
  }
}

export class BaseModel extends Model {
  static get QueryBuilder() {
    return QueryBuilder;
  }
}

export default BaseModel;
