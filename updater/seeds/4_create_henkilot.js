exports.seed = async (knex) => {
  await knex('henkilo').del();

  await knex('henkilo').insert([
    {
      htunnus: 'DOE_J',
      etunimet: 'John',
      sukunimi: 'Doe',
      hy_puhelinluettelossa: 'E',
      hy_tyosuhde: 'K',
    },
  ]);
};
