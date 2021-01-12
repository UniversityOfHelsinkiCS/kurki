import { useParams } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import useCourseUnitRealisationsByProgramme from '../hooks/useCourseUnitRealisationsByProgramme';
import CourseTable from './CourseTable';

const Courses = () => {
  const { programmeCode } = useParams();

  const {
    courseUnitRealisations,
    isValidating,
  } = useCourseUnitRealisationsByProgramme(programmeCode);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Kurssit {programmeCode}
      </Typography>
      {isValidating && <LinearProgress />}
      <CourseTable courseUnitRealisations={courseUnitRealisations || []} />
    </>
  );
};

export default Courses;
