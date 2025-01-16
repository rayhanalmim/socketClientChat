import { CLCreateBrowserRouter } from "@antopolis/admin-component-library/dist/helper";
import {
  AuthScreen,
  MainScreen,
} from "@antopolis/admin-component-library/dist/screens";
import Logo from "../assets/logo.png";
import authRoutes from "../Screens/AuthScreens/AuthRoutes";
import mainRoutes from "../Screens/MainScreens/MainRoutes";
import { links } from "./sideLinks";

const routes = CLCreateBrowserRouter([
  {
    path: "/",
    element: (
      <MainScreen
        links={links}
        logo={Logo}
        isRoleBased={false}
        title={"Anthill Club"}
        // isPermissionBased={true}
        // isSettingsRequired={true}
        // isSettingsRequired={false}
      />
    ),
    children: mainRoutes,
  },
  {
    path: "/auth",
    element: <AuthScreen />,
    children: authRoutes,
  },
]);

export default routes;
