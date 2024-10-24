// import authRoutes from '@/components/screens/AuthScreen/AuthRoutes';
// import AuthScreens from '@/components/screens/AuthScreen/AuthScreens';

// import MainRoutes from '@/components/screens/MainScreen/MainRoutes';
// import MainScreens from '@/components/screens/MainScreen/MainScreens';
import { CLCreateBrowserRouter } from '@antopolis/admin-component-library/dist/helper';
import { AuthScreen } from '@antopolis/admin-component-library/dist/screens'
import authRoutes from '../Screens/AuthScreens/AuthRoutes';
import Test from '../Test/Test';

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
    path: '/test',
    element: <Test />
  }
]);

export default routes;

