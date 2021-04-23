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
        name: 'Dashboard',
        icon: 'DashboardOutlined',
        component: '@/pages/dashboard',
      },
      {
        path: '/order',
        name: 'Order',
        icon: 'SnippetsOutlined',
        component: '@/pages/order',
      },
      {
        path: '/sales',
        component: '@/pages/sales',
        name: 'Sales',
        icon: 'UserOutlined',
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
        parentPath: '/clients'
      },
      {
        path: '/clients/individual/:id',
        component: '@/pages/individual/Detail',
        name: 'Individual Client',
        icon: 'ContactsOutlined',
        hideInMenu: true,
      },
      {
        path: '/clients/company',
        component: '@/pages/individual',
        name: 'Company Client',
        icon: 'HomeOutlined',
        parentPath: '/clients'
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
