exports.seed = async (knex) => {
  await knex('kurssin_tyyppi').del();

  await knex('kurssin_tyyppi').insert([
    {
      tyyppi: 'K',
      kuvaus: 'Luentokurssi',
      tnro: 1,
    },
    {
      tyyppi: 'L',
      kuvaus: 'Loppukoe',
      tnro: 2,
    },
    {
      tyyppi: 'Y',
      kuvaus: 'Kypsyyskoe',
      tnro: 3,
    },
    {
      tyyppi: 'A',
      kuvaus: 'Laboratorio',
      tnro: 4,
    },
    {
      tyyppi: 'S',
      kuvaus: 'Seminaari',
      tnro: 5,
    },
  ]);
};
