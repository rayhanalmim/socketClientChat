import {
  IconBuildings,
  IconDashboard,
  IconTable,
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
    icon: <IconBuildings size={20} />,
  },
  {
    label: 'Course Category',
    path: '/main/courseCategories',
    icon: <IconTable size={20} />,
  },

];
