import { IBestAFSRoute } from '@umijs/plugin-layout';

export const routes: IBestAFSRoute[] = [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      { exact: true, path: '/', redirect: '/dashboard' },
      {
        path: '/dashboard',
        exact: true,
        component: '@/pages/index',
        name: 'Dashboard',
        icon: 'DashboardOutlined',
      },
      {
        path: '/login',
        component: '@/pages/login/',
        name: 'Login',
        icon: 'ContactsOutlined',
      },
    ],
  },
];
