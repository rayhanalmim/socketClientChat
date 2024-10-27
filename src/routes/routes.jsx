// import { CLCreateBrowserRouter } from '@antopolis/admin-component-library/dist/helper';
// import { AuthScreen } from '@antopolis/admin-component-library/dist/screens'

import { CLCreateBrowserRouter } from "@antopolis/admin-component-library/src/Helpers/Helpers";
import { AuthScreen, MainScreen } from "@antopolis/admin-component-library/src/Screens/Screens";
import { EntityProvider } from "@antopolis/admin-component-library/src/Hooks/Hooks";
import { links } from "./sideLinks";
import authRoutes from "../Screens/AuthScreens/AuthRoutes";
import mainRoutes from "../Screens/MainScreens/MainRoutes";
import Logo from '../assets/logo.png';
import App from "../App";

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
  {
    path: "/test",
    element: (
      <EntityProvider>
        <App />
      </EntityProvider>
    ),
  },
]);

export default routes;
