import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import useCourseUnitRealisationsByProgramme from '../hooks/useCourseUnitRealisationsByProgramme';
import CourseTable from './CourseTable';
import TextField from './TextField';

const useStyles = makeStyles((theme) => ({
  filterField: {
    marginBottom: theme.spacing(2),
  },
}));

const getFilteredCourseUnitRealisations = (filter, courseUnitRealisations) => {
  if (!courseUnitRealisations) {
    return [];
  }

  if (!filter) {
    return courseUnitRealisations;
  }

  return courseUnitRealisations.filter((c) => {
    const filterValues = [...Object.values(c.name), c.id].filter(Boolean);

    return Boolean(
      filterValues.find((v) => v.toLowerCase().includes(filter.toLowerCase())),
    );
  });
};

const Courses = () => {
  const classes = useStyles();
  const { programmeCode } = useParams();
  const [filter, setFilter] = useState('');

  const {
    courseUnitRealisations,
    isValidating,
  } = useCourseUnitRealisationsByProgramme(programmeCode);

  const filteredCourseUnitRealisations = useMemo(() => {
    return getFilteredCourseUnitRealisations(filter, courseUnitRealisations);
  }, [filter, courseUnitRealisations]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Kurssit {programmeCode}
      </Typography>

      <TextField
        label="Hae"
        placeholder="Hae id:llä tai nimellä"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={classes.filterField}
        fullWidth
      />

      {isValidating && <LinearProgress />}
      <CourseTable courseUnitRealisations={filteredCourseUnitRealisations} />
    </>
  );
};

export default Courses;
