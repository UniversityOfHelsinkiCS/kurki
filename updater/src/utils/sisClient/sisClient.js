import { isArray } from 'lodash';

class SisClient {
  constructor({ importerClient }) {
    this.importerClient = importerClient;
  }

  async getCourseUnits(options = {}) {
    const { codes } = options;

    if (!isArray(codes) || codes.length === 0) {
      // At the moment codes array is required
      throw new Error('At least one course code is required');
    }

    const params = {
      codes: codes.join(','),
    };

    const { data } = await this.importerClient.get('/course_units', {
      params,
    });

    return data;
  }

  getCourseUnitsByCodes(codes) {
    return this.getCourseUnits({ codes });
  }

  async getCourseUnitsByProgramme(programme) {
    if (!programme) {
      throw new Error('Programme is required');
    }

    const { data } = await this.importerClient.get(
      `/course_units/programme/${programme}`,
    );

    return data && data.course_units ? data.course_units : [];
  }

  async getCourseUnitRealisationsByCode(code, options = {}) {
    if (!code) {
      throw new Error('Course code is required');
    }

    const { activityPeriodEndDateAfter } = options;

    const params = {
      code,
      ...(activityPeriodEndDateAfter && {
        activityPeriodEndDateAfter: activityPeriodEndDateAfter.toISOString(),
      }),
    };

    const { data } = await this.importerClient.get(
      '/course_unit_realisations',
      {
        params,
      },
    );

    return data;
  }

  async getCourseUnitRealisationResponsibilityInfos(id) {
    const { data } = await this.importerClient.get(
      `/course_unit_realisations/${id}/responsibility_infos`,
    );

    return data;
  }

  async getCourseUnitRealisationStudyGroupSets(id) {
    const { data } = await this.importerClient.get(
      `/course_unit_realisations/${id}/study_group_sets`,
    );

    return data;
  }

  getCourseUnitRealisationEnrolments(id) {
    const { data } = await this.importerClient.get(
      `/course_unit_realisations/${id}/enrolments`,
    );

    return data;
  }
}

export default SisClient;
