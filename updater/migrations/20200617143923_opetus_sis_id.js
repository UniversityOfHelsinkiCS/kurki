exports.up = function (knex) {
  return knex.schema.alterTable('opetus', (table) => {
    table.string('sis_id').unique();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('opetus', (table) => {
    table.dropColumn('sis_id');
  });
};
