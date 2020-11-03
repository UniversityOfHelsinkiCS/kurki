exports.seed = async (knex) => {
  await knex('kurssin_tila').del();

  await knex('kurssin_tila').insert([
    { tila: 'S', kuvaus: 'Suunnittelu' },
    { tila: 'O', kuvaus: 'Odotustila' },
    { tila: 'I', kuvaus: 'Kurssille voi ilmoittautua' },
    { tila: 'P', kuvaus: 'Kurssille ei voi ilmoittautua' },
    { tila: 'A', kuvaus: 'Arvostelu' },
    { tila: 'V', kuvaus: 'Valmis' },
    { tila: 'J', kuvaus: 'Jaadytetty' },
    { tila: 'M', kuvaus: 'Ei voi perua' },
    { tila: 'E', kuvaus: 'Ennakkoilmoittautuminen' },
  ]);
};
