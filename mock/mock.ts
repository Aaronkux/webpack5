import Mock, { Random } from 'mockjs';

export default {
  // 支持值为 Object 和 Array
  'POST /api/login': {
    data: {
      users: {
        firstname: 'aaron',
        lastname: 'wo',
        email: 'sbvjaiwxd@gmail.com',
        salesPermission: true,
        clientPermission: true,
        orderPermission: true,
        emailPermission: true,
        token: 'abc',
      },
    },
    success: true,
  },
  'GET /api/sales': Mock.mock({
    data: {
      'sales|8': [
        {
          id: '@id',
          name: '@name',
          email: '@email',
          photo: '@IMG',
          isActive: '@boolean(1, 1, true)',
        },
      ],
      total: 100,
    },
    success: true,
  }),
  'GET /api/sales/:id': Mock.mock({
    'data': {
      id: '@id',
      name: '@name',
      email: '@email',
      photo: '@IMG',
      isActive: '@boolean(1, 1, true)',
    },
    success: true,
  }),
};
