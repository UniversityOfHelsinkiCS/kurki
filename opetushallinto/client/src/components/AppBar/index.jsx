import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import MenuDrawer from './MenuDrawer';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const AppBar = () => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  const onToggleMenu = () =>
    setMenuOpen((previousMenuOpen) => !previousMenuOpen);

  return (
    <>
      <MenuDrawer onClose={onToggleMenu} open={menuOpen} />
      <MuiAppBar position="relative">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.menuButton}
            onClick={onToggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Opetushallinto
          </Typography>
        </Toolbar>
      </MuiAppBar>
    </>
  );
};

export default AppBar;
