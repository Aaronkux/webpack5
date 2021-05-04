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
  unsubscribe: boolean;
  id1ExpireDate: string;
  other?: string;
  signature: string;
}
export type IndividualClientsResponse = ResponseType<{
  clients: IndividualClientInfo[];
  total: number;
}>;
export type IndividualClientsDetailResponse = ResponseType<IndividualClientInfo>;

export interface BeneficiaryInfo {
  id: string;
  companyClientId: number;
  individualClientId: number;
  type: 0 | 1;
  name: string;
  DOB: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  occupation: string;
  relationship: string;
  bankName: string;
  branchName: string;
  accountName: string;
  accountNumber: number;
  bsb: number;
  isTrustAccount: boolean;
  idFront: string;
  idBack: string;
  relatedDoc: string;
  idExpireDate: string;
  companyName: string;
  companyAddress: string;
  companyABN: number;
}
export type BeneficiaryResponse = ResponseType<BeneficiaryInfo[]>;
export type BeneficiaryDetailResponse = ResponseType<BeneficiaryInfo>;

export function getIndividualClients(current: number, pageSize: number) {
  return request<IndividualClientsResponse>('/api/individualclient', {
    method: 'get',
    params: {
      current,
      pageSize,
    },
  });
}

export function getIndividualClientsDetail(id: string) {
  return request<IndividualClientsDetailResponse>(
    `/api/individualclient/${id}`,
    {
      method: 'get',
    },
  );
}

export function getBeneficiaries(id: string) {
  return request<BeneficiaryResponse>(`/api/individualclient/${id}/receiver`, {
    method: 'get',
  });
}

export function getBeneficiaryDetail(id: string) {
  return request<BeneficiaryDetailResponse>(`/api/receiver/${id}`, {
    method: 'get',
  });
}
