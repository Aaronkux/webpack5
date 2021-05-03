import { useCallback } from 'react';
import { RequestConfig, useModel, request as umiRequest } from 'umi';
import { UserInfo } from '@/services/users'

export const request: RequestConfig = {
  timeout: 10000,
  // errorConfig: {},
  middlewares: [],
  requestInterceptors: [],
  responseInterceptors: [],
};

// export async function getInitialState() {
//   const data = await umiRequest<UserInfo>('/api/getCurrentUser');
//   if (data.errorMessage) {
//     throw data.errorMessage
//   }
//   return data;
// }
