import { IBestAFSRoute } from '@umijs/plugin-layout';

export const routes: IBestAFSRoute[] = [
  {
    path: '/',
    component: '@/layouts/index',
    hideInMenu: true,
    routes: [
      {
        path: '/',
        name: 'Dashboard',
        icon: 'DashboardOutlined',
        component: '@/pages/dashboard',
      },
      {
        path: '/sales',
        component: '@/pages/sales',
        name: 'Sales',
        icon: 'UserOutlined',
      },
      {
        path: '/order',
        name: 'Order',
        icon: 'SnippetsOutlined',
        component: '@/pages/order',
      },
      {
        path: '/order/:id',
        name: 'Order Detail',
        component: '@/pages/order/Detail',
        hideInMenu: true,
      },
      {
        path: '/clients',
        name: 'Clients',
        icon: 'ContactsOutlined',
      },
      {
        path: '/clients/individual',
        component: '@/pages/individual',
        name: 'Individual Client',
        icon: 'ContactsOutlined',
        parentPath: '/clients',
      },
      {
        path: '/clients/individual/:id',
        component: '@/pages/individual/Detail',
        name: 'Individual Client Detail',
        hideInMenu: true,
      },
      {
        path: '/clients/company',
        component: '@/pages/company',
        name: 'Company Client',
        icon: 'HomeOutlined',
        parentPath: '/clients',
      },
      {
        path: '/users',
        name: 'User',
        icon: 'UserOutlined',
        component: '@/pages/users',
      },
      {
        path: '/users/:id',
        component: '@/pages/users/Detail',
        name: 'User Detail',
        hideInMenu: true,
      },
      {
        path: '/setting',
        icon: 'SettingOutlined',
        component: '@/pages/setting',
        name: 'Setting',
      },
      {
        path: '/login',
        component: '@/pages/login',
        name: 'Login',
        hideInMenu: true,
      },
      {
        path: '/',
        exact: false,
        component: '@/pages/404',
        name: '404',
        hideInMenu: true,
      },
    ],
  },
];
