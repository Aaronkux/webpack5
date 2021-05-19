import { request } from 'umi';
import type { ResponseType, NoDataResponse } from './index';

export interface SalesInfo {
  id: string;
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

export async function querySale(id: string) {
  return await request<SingleSaleResponse>(`/api/sales/${id}`, {
    method: 'get',
  });
}

export function addSale(data: FormData) {
  return request<NoDataResponse>(`/api/sales`, {
    method: 'post',
    body: data,
  });
}
export function updateSale(id: string, data: FormData) {
  return request<NoDataResponse>(`/api/sales/${id}`, {
    method: 'put',
    body: data,
  });
}

