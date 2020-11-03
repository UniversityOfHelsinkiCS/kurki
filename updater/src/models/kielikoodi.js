import BaseModel from './baseModel';

class Kielikoodi extends BaseModel {
  static get idColumn() {
    return 'kielikoodi';
  }

  static get tableName() {
    return 'kielikoodi';
  }
}

export default Kielikoodi;
