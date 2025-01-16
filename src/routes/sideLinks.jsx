import {
  IconDashboard,
  IconTable,
  IconCategory,
  IconMessage
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
  {
    label: 'Chat',
    path: '/main/chat',
    icon: <IconMessage size={20} />, // Change the icon here
  },

];
