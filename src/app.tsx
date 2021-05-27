import { RequestConfig } from 'umi';
import store from 'store';
// admin@test.com
export const request: RequestConfig = {
  timeout: 10000,
  middlewares: [],
  requestInterceptors: [
    (url, options) => {
      return {
        url,
        options: {
          ...options,
          headers: {
            Authorization: 'Token ' + store.get('token'),
          },
        },
      };
    },
  ],
  responseInterceptors: [],
};

// export async function getInitialState() {
//   const data = await umiRequest<UserInfo>('/api/getCurrentUser');
//   if (data.errorMessage) {
//     throw data.errorMessage
//   }
//   return data;
// }
