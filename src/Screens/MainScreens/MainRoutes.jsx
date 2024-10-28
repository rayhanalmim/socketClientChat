import Dashboard from "./Dashboard/dashboard";
import Course from "./Course/Course";
import CourseCategory from "./CourseCategory/CourseCategory";
import CourseSubCategory from "./CourseSubCategory/CourseSubCategory";

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
    {
        path: main + 'courseSubCategories/:id',
        element: <CourseSubCategory />
    },

];

export default mainRoutes;
