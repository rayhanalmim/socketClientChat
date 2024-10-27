import Dashboard from "./Dashboard/dashboard";
import Course from "./Course/Course";
import CourseCategory from "./CourseCategory/CourseCategory";

const main = 'main/';

const mainRoutes = [
    {
        path: main + 'dashboard',
        element: <Dashboard />,
    },
    {
        path: main + 'courses',
        element: <Course />,
    },
    {
        path: main + 'courseCategories',
        element: <CourseCategory />,
    },

];

export default mainRoutes;
