import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import Main from './Main';

const App = () => (
  <>
    <CssBaseline />
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </>
);

export default App;
