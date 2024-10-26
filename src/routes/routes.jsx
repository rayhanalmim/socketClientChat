
// import { CLCreateBrowserRouter } from '@antopolis/admin-component-library/dist/helper';
// import { AuthScreen } from '@antopolis/admin-component-library/dist/screens'
import { CLCreateBrowserRouter } from '@antopolis/admin-component-library/src/Helpers/Helpers';
import { AuthScreen } from '@antopolis/admin-component-library/src/Screens/Screens'

import authRoutes from '../Screens/AuthScreens/AuthRoutes';
import Test from '../Test/Test';
import App from '../App';

const routes = CLCreateBrowserRouter([
  // {
  //   path: '/',
  //   element: <MainScreens />,
  //   children: MainRoutes,
  // },
  {
    path: '/auth',
    element: <AuthScreen />,
    children: authRoutes,
  },
  {
    path: '/',
    element: <App />
  }
]);

export default routes;

