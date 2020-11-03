exports.seed = async (knex) => {
  await knex('kielikoodi').del();

  await knex('kielikoodi').insert([
    {
      kielikoodi: 'S',
      kieli: 'Suomi',
      kielitunnus: 1,
    },
    {
      kielikoodi: 'R',
      kieli: 'Ruotsi',
      kielitunnus: 2,
    },
    {
      kielikoodi: 'E',
      kieli: 'Englanti',
      kielitunnus: 3,
    },
  ]);
};
