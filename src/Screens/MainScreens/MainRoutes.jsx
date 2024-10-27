import Dashboard from "./Dashboard/dashboard";
import Course from "./Course/Course";
import CourseCategory from "./CourseCategory/CourseCategory";
import { EntityProvider } from "@antopolis/admin-component-library/src/Hooks/Hooks";
import CourseSubCategory from "./CourseSubCategory/CourseSubCategory";

const main = 'main/';

const mainRoutes = [
    {
        path: main + 'dashboard',
        element: <Dashboard />,
    },
    {
        path: main + 'courses',
        element: (
            <EntityProvider>
                <Course />
            </EntityProvider>
        ),
    },
    {
        path: main + 'courseCategories',
        element: (
            <EntityProvider>
                <CourseCategory />
            </EntityProvider>

        ),
    },
    {
        path: main + 'courseSubCategories/:id',
        element: (
            <EntityProvider>
                <CourseSubCategory />
            </EntityProvider>

        ),
    },

];

export default mainRoutes;
