import { IBestAFSRoute } from '@umijs/plugin-layout';

export const routes: IBestAFSRoute[] = [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      { path: '/', redirect: '/dashboard' },
      {
        path: '/dashboard',
        component: '@/pages/dashboard',
        name: 'Dashboard',
        icon: 'DashboardOutlined',
      },
      {
        path: '/login',
        component: '@/pages/login/',
        name: 'Login',
        icon: 'ContactsOutlined',
      },
      {
        path: '/',
        exact: false,
        component: '@/pages/404/',
        name: '404',
        icon: 'FrownOutlined',
      },
    ],
  },
];
