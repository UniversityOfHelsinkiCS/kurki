import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import AddTeacherForm from './AddTeacherForm';
import useCourseUnitRealisation from '../../hooks/useCourseUnitRealisation';
import Alert from '../Alert';
import addTeacherForCourseUnitRealisation from '../../utils/addTeacherForCourseUnitRealisation';

const useStyles = makeStyles((theme) => ({
  alert: {
    marginBottom: theme.spacing(2),
  },
}));

const getDisplayName = (person) => {
  return person.firstNames && person.lastName
    ? `${person.firstNames} ${person.lastName}`
    : person.id;
};

const Content = ({ courseUnitRealisation, onSubmit }) => {
  const classes = useStyles();

  const teachers = courseUnitRealisation
    ? courseUnitRealisation.kurkiTeachers || []
    : [];
  const isInKurki = courseUnitRealisation && courseUnitRealisation.inKurki;

  if (!courseUnitRealisation) {
    return null;
  }

  if (!isInKurki) {
    return (
      <Alert severity="warning">
        Kurssi tulee tuoda Kurkeen ennen kuin opettajia voi lisätä
      </Alert>
    );
  }

  const currentTeachersAlert =
    teachers.length > 0 ? (
      <Alert severity="info" className={classes.alert}>
        Kurssilla on jo seuraavat opettajat:{' '}
        {teachers.map(getDisplayName).join(', ')}
      </Alert>
    ) : null;

  return (
    <>
      {currentTeachersAlert}
      <AddTeacherForm onSubmit={onSubmit} />
    </>
  );
};

const AddTeacherDialog = ({ open, onClose, courseUnitRealisationId }) => {
  const { courseUnitRealisation, revalidate } = useCourseUnitRealisation(
    courseUnitRealisationId,
  );

  const handleSubmit = async ({ personId }) => {
    try {
      await addTeacherForCourseUnitRealisation({
        courseUnitRealisationId,
        personId,
      });

      revalidate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">Lisää opettaja</DialogTitle>
      <DialogContent>
        <Content
          courseUnitRealisation={courseUnitRealisation}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Sulje
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTeacherDialog;
