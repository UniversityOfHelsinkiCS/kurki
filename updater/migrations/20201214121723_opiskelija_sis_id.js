exports.up = function (knex) {
  return knex.schema.alterTable('opiskelija', (table) => {
    table.string('sis_id').unique();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('opiskelija', (table) => {
    table.dropColumn('sis_id');
  });
};
