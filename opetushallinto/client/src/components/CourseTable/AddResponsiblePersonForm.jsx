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

const AddResponsiblePersonForm = ({ onSubmit }) => {
  const classes = useStyles();
  const { persons } = usePersons();
  const [person, setPerson] = useState(null);

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

    if (!person) {
      return;
    }

    onSubmit({ personId: person.value });
    setPerson(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Autocomplete
        className={classes.autocomplete}
        options={options}
        getOptionLabel={({ label }) => label}
        value={person}
        onChange={(event, value) => {
          setPerson(value);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Vastuuhenkilö" />
        )}
      />

      <Button disabled={!person} variant="contained" color="primary" type="submit">
        Lisää vastuuhenkilö
      </Button>
    </form>
  );
};

export default AddResponsiblePersonForm;
