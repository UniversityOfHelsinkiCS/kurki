import { Switch, Route, Redirect } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from './AppBar';
import Home from './Home';
import Courses from './Courses';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const Main = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar />
      <Container className={classes.container}>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/courses/:programmeCode">
            <Courses />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Container>
    </>
  );
}

export default Main;
