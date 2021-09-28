import logger from '../logger'

const getEnrolmentOpetus = (enrolment, opetukset) => {
  // this is erilliskoe
  if (opetukset.length === 1 && opetukset[0].tyyppi === 'L' ) {
    return opetukset[0]
  }

  const group99 = opetukset.find(({ ilmoJnro }) => ilmoJnro === 99);

  let studySubGroupIds = (enrolment.study_sub_groups || enrolment.studySubGroups  || []).map(
    ({ studySubGroupId }) => studySubGroupId,
  );

  const opetus = opetukset.find(({ sisId, opetustehtava }) => {
    return opetustehtava === 'LH' && studySubGroupIds.includes(sisId);
  });

  return opetus ? opetus : group99;
};

const getOsallistuminenByEnrolment = (enrolment, opetukset) => {
  const opetus = getEnrolmentOpetus(enrolment, opetukset);

  if (!opetus) {
    logger.error(`Could not resolve a study group for enrolment ${enrolment.id}`);
    throw new Error(
      `Could not resolve a study group for enrolment ${enrolment.id}`,
    );
  }

  return {
    voimassa: enrolment.state === 'ENROLLED' ? 'K' : 'P',
    kurssikoodi: opetus.kurssikoodi,
    lukuvuosi: opetus.lukuvuosi,
    lukukausi: opetus.lukukausi,
    tyyppi: opetus.tyyppi,
    kurssiNro: opetus.kurssiNro,
    ryhmaNro: opetus.ryhmaNro,
    ilmoJnro: opetus.ilmoJnro,
    ilmoittautumisPvm: enrolment.enrolmentDateTime
      ? new Date(enrolment.enrolmentDateTime)
      : null,
    sisId: enrolment.id,
  };
};

export default getOsallistuminenByEnrolment;
