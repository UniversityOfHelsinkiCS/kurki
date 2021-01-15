import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import { BASE_PATH } from '../config';
import Main from './Main';

const App = () => (
  <>
    <CssBaseline />
    <BrowserRouter basename={BASE_PATH}>
      <Main />
    </BrowserRouter>
  </>
);

export default App;
