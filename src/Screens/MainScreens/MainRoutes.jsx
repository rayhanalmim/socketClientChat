import Dashboard from "./Dashboard/dashboard";
import Course from "./Course/Course";
import CourseCategory from "./CourseCategory/CourseCategory";
import CourseSubCategory from "./CourseSubCategory/CourseSubCategory";
import Chat from "./Chat/Chat";
import { SocketProvider } from "../../Context/SocketContext";

const main = "main/";

const mainRoutes = [
  {
    path: main + "dashboard",
    element: <Dashboard />,
  },
  {
    path: main + "courses",
    element: <Course />,
  },
  {
    path: main + "chat",
    element: (
      <SocketProvider>
        <Chat />
      </SocketProvider>
    ),
  },
  {
    path: main + "courseCategories",
    element: <CourseCategory />,
  },
  {
    path: main + "chat",
    element: <CourseSubCategory />,
  },
];

export default mainRoutes;
