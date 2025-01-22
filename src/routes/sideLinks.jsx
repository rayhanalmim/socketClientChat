import {
  IconDashboard,
  IconTable,
  IconMessage
} from '@tabler/icons-react';

export const links = [
  {
    label: 'Dashboard',
    path: '/main/dashboard',
    icon: <IconDashboard size={20} />,
  },
  {
    label: 'Channels',
    path: '/main/channels',
    icon: <IconTable size={20} />,
  },
  {
    label: 'Chat',
    path: '/main/chat',
    icon: <IconMessage size={20} />, // Change the icon here
  },

];
