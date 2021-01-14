import { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';

import useUpdaterStatusReports from '../../hooks/useUpdaterStatusReports';
import useUpdaterLogMessages from '../../hooks/useUpdaterLogMessages';
import Alert from '../Alert';
import LogTable from './LogTable';

const useStyles = makeStyles((theme) => ({
  statusContainer: {
    marginBottom: theme.spacing(2),
  },
}));

const formatDate = (maybeDate) => {
  return maybeDate ? format(new Date(maybeDate), 'dd.MM.yyyy HH:mm') : null;
};

const getLogMessagesInStatusReport = (statusReport, logMessages) => {
  if (!statusReport || !logMessages) {
    return [];
  }

  const { startDate, endDate } = statusReport;

  return logMessages.filter(({ timestamp, level }) => {
    if (!timestamp) {
      return false;
    }

    const timestampDate = new Date(timestamp);

    const isInRange =
      timestampDate >= new Date(startDate) &&
      timestampDate <= new Date(endDate);

    const hasCorrectLevel = ['warning', 'error'].includes(level);

    return isInRange && hasCorrectLevel;
  });
};

const Status = () => {
  const classes = useStyles();
  const { statusReports } = useUpdaterStatusReports();
  const { logMessages } = useUpdaterLogMessages();

  const latestStatusReport = statusReports?.[0];

  const statusReportLogMessages = useMemo(
    () => getLogMessagesInStatusReport(latestStatusReport, logMessages),
    [latestStatusReport, logMessages],
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Siirron tila
      </Typography>

      <div className={classes.statusContainer}>
        {latestStatusReport ? (
          <Alert severity="info">
            Viimeisin siirto Kurkeen tapahtui{' '}
            {formatDate(latestStatusReport.startDate)} -{' '}
            {formatDate(latestStatusReport.endDate)}
          </Alert>
        ) : (
          <Alert severity="warning">Siirron tietoja ei ole saatavilla</Alert>
        )}
      </div>

      <Typography variant="h5" gutterBottom>
        Virhelokit
      </Typography>

      {statusReportLogMessages.length === 0 ? (
        <Alert severity="success">Siirron aikana ei tapahtunut virheitä</Alert>
      ) : (
        <LogTable logMessages={statusReportLogMessages} />
      )}
    </>
  );
};

export default Status;
