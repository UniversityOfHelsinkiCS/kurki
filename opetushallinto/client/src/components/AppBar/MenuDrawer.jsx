import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  drawerPaper: {
    minWidth: '250px',
  },
}));

const PROGRAMMES = [
  { label: 'Kandi', code: '500-K005' },
  { label: 'Maisteri', code: '500-M009' },
  { label: 'Datatiede', code: '500-M010' },
  { label: 'Vanha', code: 'H523' },
];

const MenuDrawer = ({ open = false, onClose }) => {
  const classes = useStyles();

  const itemProps = {
    component: Link,
    button: true,
    onClick: onClose,
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      classes={{ paper: classes.drawerPaper }}
    >
      <List>
        <ListItem {...itemProps} to="/">
          <ListItemText primary="Siirron tila" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {PROGRAMMES.map(({ label, code }) => (
          <ListItem {...itemProps} to={`/courses/${code}`} key={code}>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuDrawer;
