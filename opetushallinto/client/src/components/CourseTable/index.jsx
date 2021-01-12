import { useRef, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import getTranslation from '../../utils/getTranslation';
import AddResponsiblePersonDialog from './AddResponsiblePersonDialog';

const ActionsMenu = ({ onAddResponsiblePerson }) => {
  const buttonRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuOpen = () =>
    setMenuOpen((previousMenuOpen) => !previousMenuOpen);

  const itemProps = {
    onClick: toggleMenuOpen,
  };

  return (
    <>
      <IconButton onClick={toggleMenuOpen} ref={buttonRef}>
        <MoreIcon />
      </IconButton>
      <Menu
        anchorEl={buttonRef.current}
        open={menuOpen}
        onClose={toggleMenuOpen}
      >
        <MenuItem
          onClick={() => {
            onAddResponsiblePerson();
            itemProps.onClick();
          }}
        >
          Lisää vastuuhenkilö
        </MenuItem>
        <MenuItem {...itemProps}>Käynnistä tuonti Kurkeen</MenuItem>
      </Menu>
    </>
  );
};

const CourseTable = ({ courseUnitRealisations }) => {
  const [
    addResponsiblePersonDialogOpen,
    setAddResponsiblePersonDialogOpen,
  ] = useState(false);

  const [
    currentCourseUnitRealisationId,
    setCurrentCourseUnitRealisationId,
  ] = useState();

  const onToggleAddResponsiblePersonDialog = () => {
    setAddResponsiblePersonDialogOpen((previousOpen) => !previousOpen);
  };

  return (
    <>
      <AddResponsiblePersonDialog
        open={addResponsiblePersonDialogOpen}
        onClose={onToggleAddResponsiblePersonDialog}
        courseUnitRealisationId={currentCourseUnitRealisationId}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courseUnitRealisations.map((courseUnitRealisation) => {
              const { id, name } = courseUnitRealisation;

              return (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {id}
                  </TableCell>
                  <TableCell align="right">{getTranslation(name)}</TableCell>
                  <TableCell align="right">
                    <ActionsMenu
                      onAddResponsiblePerson={() => {
                        setCurrentCourseUnitRealisationId(
                          courseUnitRealisation.id,
                        );

                        onToggleAddResponsiblePersonDialog();
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CourseTable;
