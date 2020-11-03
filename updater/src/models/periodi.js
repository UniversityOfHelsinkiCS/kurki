import { orderBy, first, last } from 'lodash';
import { getYear, isValid, isWithinInterval, getMonth } from 'date-fns';
import BaseModel, { QueryBuilder } from './baseModel';

const isChristmas = async (Model, date, periods) => {
  const month = getMonth(date) + 1;
  const year = getYear(date);

  const periodExtensions =
    month === 1
      ? await Model.query().where({ vuosi: year - 1 })
      : await Model.query().where({ vuosi: year + 1 });

  const extendedPeriods = [...periods, ...periodExtensions];

  const period2 = first(
    orderBy(
      extendedPeriods.filter(({ pnumero }) => pnumero === 2),
      'alkupvm',
    ),
  );

  const period3 = last(
    orderBy(
      extendedPeriods.filter(({ pnumero }) => pnumero === 3),
      'alkupvm',
    ),
  );

  return isWithinInterval(date, {
    start: period2.alkupvm,
    end: period3.alkupvm,
  });
};

class EnhancedQueryBuilder extends QueryBuilder {
  async findPnumeroByDate(date) {
    const Model = this.modelClass();

    if (!date) {
      return undefined;
    }

    const normalizedDate = new Date(date);

    if (!isValid(normalizedDate)) {
      return undefined;
    }

    const year = getYear(normalizedDate);

    const periods = await Model.query().where({
      vuosi: year,
    });

    const targetPeriod = periods.find(({ alkupvm, loppupvm }) => {
      return isWithinInterval(normalizedDate, {
        start: alkupvm,
        end: loppupvm,
      });
    });

    if (targetPeriod) {
      return targetPeriod.pnumero;
    }

    if (await isChristmas(Model, normalizedDate, periods)) {
      return 2;
    }
  }
}

class Periodi extends BaseModel {
  static get QueryBuilder() {
    return EnhancedQueryBuilder;
  }

  static get idColumn() {
    return ['vuosi', 'pnumero'];
  }

  static get tableName() {
    return 'periodi';
  }
}

export default Periodi;
