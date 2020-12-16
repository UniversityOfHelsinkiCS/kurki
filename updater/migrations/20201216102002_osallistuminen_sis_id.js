exports.up = function (knex) {
  return knex.schema.alterTable('osallistuminen', (table) => {
    table.string('sis_id').unique();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('osallistuminen', (table) => {
    table.dropColumn('sis_id');
  });
};
