import { CLCreateBrowserRouter } from '@antopolis/admin-component-library/dist/helper.cjs';
import { AuthScreen, MainScreen } from '@antopolis/admin-component-library/dist/screens.cjs'

// import { CLCreateBrowserRouter } from "@antopolis/admin-component-library/src/Helpers/Helpers";
// import { AuthScreen, MainScreen } from "@antopolis/admin-component-library/src/Screens/Screens";

import { links } from "./sideLinks";
import authRoutes from "../Screens/AuthScreens/AuthRoutes";
import mainRoutes from "../Screens/MainScreens/MainRoutes";
import Logo from '../assets/logo.png';

const routes = CLCreateBrowserRouter([
  {
    path: '/',
    element: <MainScreen links={links} logo={Logo} title={'Shehan Ventures'} />,
    children: mainRoutes,
  },
  {
    path: "/auth",
    element: <AuthScreen />,
    children: authRoutes,
  },
  // {
  //   path: "/test",
  //   element: (
  //     <EntityProvider>
  //       <App />
  //     </EntityProvider>
  //   ),
  // },
]);

export default routes;
