import { useMemo, useState } from 'react';
import Autocomplete from '../Autocomplete';
import TextField from '../TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import usePersons from '../../hooks/usePersons';

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    marginBottom: theme.spacing(2),
  },
}));

const getLabel = (person) => {
  return person.firstNames && person.lastName
    ? `${person.firstNames} ${person.lastName}`
    : person.id;
};

const AddTeacherForm = ({ onSubmit }) => {
  const classes = useStyles();
  const { persons } = usePersons();
  const [teacher, setTeacher] = useState(null);

  const options = useMemo(() => {
    return persons
      ? persons.map((p) => ({
          label: getLabel(p),
          value: p.id,
        }))
      : [];
  }, [persons]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!teacher) {
      return;
    }

    onSubmit({ personId: teacher.value });
    setTeacher(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Autocomplete
        className={classes.autocomplete}
        options={options}
        getOptionLabel={({ label }) => label}
        value={teacher}
        onChange={(event, value) => {
          setTeacher(value);
        }}
        renderInput={(params) => <TextField {...params} label="Opettaja" />}
      />

      <Button
        disabled={!teacher}
        variant="contained"
        color="primary"
        type="submit"
      >
        Lisää opettaja
      </Button>
    </form>
  );
};

export default AddTeacherForm;
