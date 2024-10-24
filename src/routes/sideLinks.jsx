import {
  IconBuildings,
  IconCrown,
  IconDashboard,
  IconMessage,
  IconUsers,
} from '@tabler/icons-react';

export const links = [
  {
    label: 'Dashboard',
    path: '/main/dashboard',
    icon: <IconDashboard size={20} />,
  },
  {
    label: 'Organizations',
    path: '/main/Organizations',
    icon: <IconBuildings size={20} />,
  },
  {
    label: 'Anthill Work Users',
    path: '/main/anthillWorkUsers',
    icon: <IconUsers size={20} />,
  },
  {
    label: 'Subscriptions',
    path: '/main/subscriptions',
    icon: <IconUsers size={20} />,
  },
  {
    label: 'Subscription Requests',
    path: '/main/subscriptionRequests',
    icon: <IconMessage size={20} />,
  },
  {
    label: 'Moderators',
    path: '/main/moderators',
    icon: <IconCrown size={20} />,
  },
];
