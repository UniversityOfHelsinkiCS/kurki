import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import useCourseUnitRealisation from '../../hooks/useCourseUnitRealisation';

const KurkiPayloadDialog = ({ open, onClose, courseUnitRealisationId }) => {
  const { courseUnitRealisation } = useCourseUnitRealisation(
    courseUnitRealisationId,
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">Kurssin tiedot Kurjessa</DialogTitle>
      <DialogContent>
        {courseUnitRealisation?.kurkiData && (
          <pre>{JSON.stringify(courseUnitRealisation.kurkiData, null, 2)}</pre>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Sulje
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KurkiPayloadDialog;
