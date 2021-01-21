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
import Link from '@material-ui/core/Link';
import { format } from 'date-fns';

import getTranslation from '../../utils/getTranslation';
import AddTeacherDialog from './AddTeacherDialog';

const formatActivityPeriod = (activityPeriod) => {
  const { startDate, endDate } = activityPeriod ?? {};

  if (!startDate || !endDate) {
    return '-';
  }

  const dateFormat = 'dd.MM.yyyy';

  const formattedStartDate = format(new Date(startDate), dateFormat);
  const formattedEndDate = format(new Date(endDate), dateFormat);

  return `${formattedStartDate} - ${formattedEndDate}`;
};

const CourseLink = ({ code }) => {
  const href = `https://courses.helsinki.fi/fi/${code}`;

  return <Link href={href} target="_blank">{code}</Link>;
};

const ActionsMenu = ({ onAddTeacher }) => {
  const buttonRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuOpen = () =>
    setMenuOpen((previousMenuOpen) => !previousMenuOpen);

  const handleAddTeacher = () => {
    onAddTeacher();
    toggleMenuOpen();
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
        <MenuItem onClick={handleAddTeacher}>Lisää opettaja</MenuItem>
      </Menu>
    </>
  );
};

const CourseTable = ({ courseUnitRealisations }) => {
  const [addTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);

  const [
    currentCourseUnitRealisationId,
    setCurrentCourseUnitRealisationId,
  ] = useState();

  const onToggleAddTeacherDialog = () => {
    setAddTeacherDialogOpen((previousOpen) => !previousOpen);
  };

  const makeOnAddTeacher = (courseUnitRealisationId) => () => {
    setCurrentCourseUnitRealisationId(courseUnitRealisationId);
    onToggleAddTeacherDialog();
  };

  return (
    <>
      <AddTeacherDialog
        open={addTeacherDialogOpen}
        onClose={onToggleAddTeacherDialog}
        courseUnitRealisationId={currentCourseUnitRealisationId}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Kurssikoodi</TableCell>
              <TableCell align="left">Nimi</TableCell>
              <TableCell align="left">Aktiivisuusjakso</TableCell>
              <TableCell align="left">Kurjessa</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courseUnitRealisations.map((courseUnitRealisation) => {
              const {
                id,
                name,
                inKurki,
                activityPeriod,
                courseUnitCode,
              } = courseUnitRealisation;

              return (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {id}
                  </TableCell>
                  <TableCell align="left">
                    {courseUnitCode ? (
                      <CourseLink code={courseUnitCode} />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="left">{getTranslation(name)}</TableCell>
                  <TableCell align="left">
                    {formatActivityPeriod(activityPeriod)}
                  </TableCell>
                  <TableCell align="left">{inKurki ? 'Kyllä' : 'Ei'}</TableCell>
                  <TableCell align="right">
                    <ActionsMenu onAddTeacher={makeOnAddTeacher(id)} />
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
