import { request } from 'umi';
import type { ResponseType } from './index';

export interface IndividualClientInfo {
  id: string;
  name: string;
  gender: 0 | 1;
  DOB: string;
  salesname: string;
  email: string;
  address: string;
  suburb: string;
  state: string;
  country: string;
  postcode: string;
  occupation: string;
  employerName: string;
  annualIncome: number;
  sourceOfIncome: string;
  id1front: string;
  id1back: string;
  id2front: string;
  id2back: string;
  faceImage: string;
  faceTest: string;
  purpose: string;
  compliance: string;
  unsubscribeue: boolean;
  id1ExpireDatereDate: string;
  other?: string;
  signature: string;
}

export type IndividualClientsResponse = ResponseType<{
  clients: IndividualClientInfo[];
  total: number;
}>;
export type IndividualClientsDetailResponse = ResponseType<IndividualClientInfo>;

export function queryAllIndividualClients(current: number, pageSize: number) {
  return request<IndividualClientsResponse>('/api/individualclient', {
    method: 'get',
    params: {
      current,
      pageSize,
    },
  });
}

export function queryIndividualClientDetail(id: string) {
  return request<IndividualClientsDetailResponse>(
    `/api/individualclient/${id}`,
    {
      method: 'get',
    },
  );
}
