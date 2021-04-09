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
        redirect: '/order/order1',
      },
      {
        path: '/order/order1',
        component: '@/pages/order',
        name: 'All Order',
        icon: 'ContactsOutlined',
        parentPath: '/order'
      },
      {
        path: '/order/order2',
        component: '@/pages/order',
        name: 'Running Order',
        icon: 'FrownOutlined',
        parentPath: '/order'
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
        redirect: '/clients/individual',
      },
      {
        path: '/clients/individual',
        component: '@/pages/clients/individual',
        name: 'Individual Client',
        icon: 'ContactsOutlined',
        parentPath: '/clients'
      },
      {
        path: '/clients/company',
        component: '@/pages/clients/company',
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
