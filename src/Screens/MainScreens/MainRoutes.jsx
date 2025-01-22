import Dashboard from "./Dashboard/Dashboard";
import Chat from "./Chat/Chat";
// import { SocketProvider } from "../../Context/SocketContext";
import Channels from "./Channel/Channels";
import ChannelMember from "./Channel/ChannelMember";

const main = "main/";

const mainRoutes = [
  {
    path: main + "dashboard",
    element: <Dashboard />,
  },
  {
    path: main + "channels",
    element: <Channels />,
  },
  {
    path: main + "chat",
    element: (
        <Chat />
    ),
  },
  {
    path: main + "channel/members/:id",
    element: < ChannelMember/>,
  },
];

export default mainRoutes;
