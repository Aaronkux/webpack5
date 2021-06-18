import { request } from 'umi';
import type { ResponseType } from './index';
import type {IndividualClientInfo, CompanyClientInfo ,BeneficiaryInfo} from './clients'
import type {UserInfo} from './users'

export interface OrderInfo {
  id: string;
  createdDate: string;
  lastModify: string;
  referral?: string;
  orderNumber: string;
  individualClient: IndividualClientInfo[]
  companyClient: CompanyClientInfo[]
  receiver: BeneficiaryInfo[]
  fromCurrency: string;
  fromAmount: number;
  toCurrency: string;
  toAmount?: number;
  feeCurrency?: string;
  feeAmount?: number;
  exchangeRate: number;
  baseRate?: number;
  comment?: string;
  department?: string;
  specialConsideration?: string;
  dispensingBank?: string;
  confirmationLetter?: string,
  compliance?: UserInfo
  fundNotified?: UserInfo
  fundReceived?: UserInfo
  confirmationSent?: UserInfo
  clientConfirmed?: UserInfo
  fundPaid?: UserInfo
}

export type OrdersResponse = ResponseType<{
  data: OrderInfo[];
  total: number;
}>;
export type OrderDetailResponse = ResponseType<OrderInfo>;

export type OrderUpdateResponse = ResponseType<{}>;
export type OrderAddResponse = ResponseType<{}>;
export type OrderDeleteResponse = ResponseType<{}>;

export function getOrders(current: number, pageSize: number) {
  return request<OrdersResponse>(`/api/orders`, {
    method: 'get',
    params: {
      limit: pageSize,
      offset: (current - 1) * pageSize,
    },
  });
}

export function getOrderDetail(id: string) {
  return request<OrderDetailResponse>(`/api/order/${id}`, {
    method: 'get',
  });
}

export function updateOrder(id: string, data: FormData) {
  return request<OrderUpdateResponse>(`/api/order/${id}`, {
    method: 'put',
    body: data,
  });
}
export function addOrder(data: FormData) {
  return request<OrderAddResponse>(`/api/order`, {
    method: 'post',
    body: data,
  });
}

export function deleteOrder(id: string) {
  return request<OrderDeleteResponse>(`/api/order/${id}`, {
    method: 'delete',
  });
}
