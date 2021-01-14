import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { format } from 'date-fns';

const formatDate = (maybeDate) => {
  return maybeDate ? format(new Date(maybeDate), 'dd.MM.yyyy HH:mm') : null;
};

const LogTable = ({ logMessages }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Aikaleima</TableCell>
            <TableCell align="left">Viesti</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logMessages.map(({ timestamp, message, id }) => {
            return (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {formatDate(timestamp)}
                </TableCell>
                <TableCell align="left">{message}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogTable;
