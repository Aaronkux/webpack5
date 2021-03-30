import { useCallback } from 'react';
import { RequestConfig, useModel, request as umiRequest } from 'umi';

export const request: RequestConfig = {
  timeout: 10000,
  // errorConfig: {},
  middlewares: [],
  requestInterceptors: [],
  responseInterceptors: [],
};

export async function getInitialState() {
  const data = await umiRequest('/api/getCurrentUser');
  return data;
}
