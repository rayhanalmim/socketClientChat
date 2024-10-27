import {
  IconBuildings,
  IconDashboard,
  IconTable,
  IconCategory
} from '@tabler/icons-react';

export const links = [
  {
    label: 'Dashboard',
    path: '/main/dashboard',
    icon: <IconDashboard size={20} />,
  },
  {
    label: 'Course',
    path: '/main/courses',
    icon: <IconTable size={20} />,
  },
  {
    label: 'Course Category',
    path: '/main/courseCategories',
    icon: <IconCategory size={20} />,
  },

];
