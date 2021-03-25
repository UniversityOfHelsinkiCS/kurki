import { format } from 'date-fns';
import { transaction } from 'objection';
import logger from '../utils/logger';

import BaseModel, { QueryBuilder } from './baseModel';

class EnhancedQueryBuilder extends QueryBuilder {
  patchOrInsertWithKurssiNro(kurssi) {
    return transaction(this.modelClass(), async (Model) => {
      const { sisId } = kurssi;

      if (!sisId) {
        throw new Error(`sisId is required`);
      }

      const sisKurssi = await Model.query().findOne({
        sisId,
      });

      if (sisKurssi) {
        await sisKurssi.$query().patch(kurssi);
        return true;
      }

      const simultaneousKurssit = await Model.query().where({
        kurssikoodi: kurssi.kurssikoodi,
        lukukausi: kurssi.lukukausi,
        lukuvuosi: kurssi.lukuvuosi,
        tyyppi: kurssi.tyyppi,
      });

      const kurssiWithSameAlkamisPvm = simultaneousKurssit.find(
        ({ alkamisPvm }) => {
          const normalizedAlkamisPvm = alkamisPvm
            ? alkamisPvm instanceof Date
              ? alkamisPvm
              : new Date(alkamisPvm)
            : null;

          if (!normalizedAlkamisPvm) {
            return false;
          }

          return (
            format(normalizedAlkamisPvm, 'yyyy-MM-dd') ===
            format(kurssi.alkamisPvm, 'yyyy-MM-dd')
          );
        },
      );

      if (kurssiWithSameAlkamisPvm) {
        logger.info('same alkamis pvm, patching');

        await Model.query()
          .findById([
            kurssiWithSameAlkamisPvm.kurssikoodi,
            kurssiWithSameAlkamisPvm.lukukausi,
            kurssiWithSameAlkamisPvm.lukuvuosi,
            kurssiWithSameAlkamisPvm.tyyppi,
            kurssiWithSameAlkamisPvm.kurssiNro,
          ])
          .patch(kurssi);

        return true;
      }

      const kurssiNro =
        simultaneousKurssit.length === 0
          ? 1
          : Math.max(...simultaneousKurssit.map(({ kurssiNro }) => kurssiNro)) +
            1;

      await Model.query().insert({ ...kurssi, kurssiNro, tila: 'P' });

      return false;
    });
  }
}

class Kurssi extends BaseModel {
  static get QueryBuilder() {
    return EnhancedQueryBuilder;
  }

  isExam() {
    return this.tyyppi === 'L';
  }

  isLab() {
    return this.tyyppi === 'A';
  }

  isCourse() {
    return this.tyyppi === 'K';
  }

  static get idColumn() {
    return ['kurssikoodi', 'lukukausi', 'lukuvuosi', 'tyyppi', 'kurssiNro'];
  }

  static get tableName() {
    return 'kurssi';
  }
}

export default Kurssi;
