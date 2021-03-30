export default {
  // 支持值为 Object 和 Array
  'GET /api/getCurrentUser': {
    data: {
      users: {
        firstname: 'aaron',
        lastname: 'wo',
        email: 'sbvjaiwxd@gmail.com',
        salesPermission: true,
        clientPermission: true,
        orderPermission: true,
        emailPermission: true,
        token: 'abc'
      },
    },
    success: false,
  },
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
        token: 'abc'
      },
    },
    success: true,
  }
};
