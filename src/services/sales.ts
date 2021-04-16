import { request } from 'umi';
import type { ResponseType } from './index';

interface SalesInfo {
  id: number;
  name: string;
  email: string;
  photo: string;
  isActive: boolean;
}

export type SalesResponse = ResponseType<SalesInfo[]>;

export function queryAllSales(current: number, pageSize: number) {
  return request<SalesResponse>('/api/sales', {
    method: 'get',
    params: {
      current,
      pageSize,
    },
  });
}
