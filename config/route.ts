import { IBestAFSRoute } from '@umijs/plugin-layout';

export const routes: IBestAFSRoute[] = [
  {
    path: '/',
    exact: true,
    component: '@/pages/index',
    name: 'Dashboard',
    icon: 'DashboardOutlined'
  },
  {
    path: '/contact',
    component: '@/pages/index',
    name: 'Contacts',
    icon: 'ContactsOutlined'
  }
];
