import { IBestAFSRoute } from '@umijs/plugin-layout';

export const routes: IBestAFSRoute[] = [
  {
    path: '/',
    component: '@/layouts/index',
    hideInMenu: true,
    routes: [
      { path: '/', redirect: '/dashboard', hideInMenu: true },
      {
        path: '/dashboard',
        component: '@/layouts/EmptyLayout',
        // component: '@/pages/dashboard',
        name: 'Dashboard',
        icon: 'DashboardOutlined',
        routes: [
          {
            path: '/dashboard/dashboard1',
            component: '@/pages/dashboard',
            name: 'Dashboard',
            icon: 'DashboardOutlined',
          },
          {
            path: '/dashboard/test',
            component: '@/pages/dashboard',
            name: 'test',
            icon: 'DashboardOutlined',
          },
        ],
      },
      {
        path: '/login',
        component: '@/pages/login/',
        name: 'Login',
        icon: 'ContactsOutlined',
        hideInMenu: true
      },
      {
        path: '/',
        exact: false,
        component: '@/pages/404/',
        name: '404',
        icon: 'FrownOutlined',
        hideInMenu: true
      },
    ],
  },
];
