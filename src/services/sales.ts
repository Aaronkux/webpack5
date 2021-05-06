import { request } from 'umi';
import type { ResponseType } from './index';

export interface SalesInfo {
  id: number;
  name: string;
  email: string;
  photo: string;
  isActive: boolean;
}

export interface SalesResType {
  sales: SalesInfo[];
  total: number;
}

export type SalesResponse = ResponseType<SalesResType>;
export type SingleSaleResponse = ResponseType<SalesInfo>;

export function queryAllSales(current: number, pageSize: number) {
  return request<SalesResponse>('/api/sales', {
    method: 'get',
    params: {
      current,
      pageSize,
    },
  });
}

export function querySale(id: number) {
  return request<SingleSaleResponse>(`/api/sales/${id}`, {
    method: 'get',
  });
}

