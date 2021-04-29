import { request } from 'umi';
import type { ResponseType } from './index';

export interface OrderInfo {
  id: string;
  orderNumber: string;
  referral?: string;
  salesman?: {
    id: string;
    name: string;
    photo: string;
  };
  clientInfo: {
    id: string;
    type: 'individual' | 'company';
    name?: string;
    abnOrAcn?: string;
    address?: string;
  };
  fromCurrency?: string;
  fromAmount?: number;
  toCurrency?: string;
  toAmount?: number;
  feeCurrency?: string;
  feeAmount?: number;
  exchangeRate?: number;
  baseRate?: number;
  comment?: string;
  department?: string;
  specialConsideration?: string;
  dispensingBank?: string;
  createdDate?: string;

  receiver: {
    id: string;
    name: string;
    bankName: string;
    accountNumber: string;
    bsb: string;
  };
  compliance?: {
    id: string;
    name: string;
    photo: string;
  };
  fundNotified?: {
    id: string;
    name: string;
    photo: string;
  };
  fundReceived?: {
    id: string;
    name: string;
    photo: string;
  };
  confirmationSent?: {
    id: string;
    name: string;
    photo: string;
  };
  clientConfirmed?: {
    id: string;
    name: string;
    photo: string;
  };
  fundPaid?: {
    id: string;
    name: string;
    photo: string;
  };
}

export type OrdersResponse = ResponseType<{
  orders: OrderInfo[];
  total: number;
}>;
export type OrderDetailResponse = ResponseType<OrderInfo>;

export type OrderUpdateResponse = ResponseType<{}>;
export type OrderDeleteResponse = ResponseType<{}>;

export function getOrders(current: number, pageSize: number) {
  return request<OrdersResponse>('/api/order', {
    method: 'get',
    params: {
      current,
      pageSize,
    },
  });
}

export function getOrderDetail(id: string) {
  return request<OrderDetailResponse>(`/api/order/${id}`, {
    method: 'get',
  });
}

export function updateOrder(id: string, fields: Partial<OrderInfo>) {
  return request<OrderUpdateResponse>(`/api/order/${id}`, {
    method: 'put',
    data: fields,
  });
}

export function deleteOrder(id: string) {
  return request<OrderDeleteResponse>(`/api/order/${id}`, {
    method: 'delete',
  });
}
