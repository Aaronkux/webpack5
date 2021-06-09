import { request } from 'umi';
import type { ResponseType, NoDataResponse } from './index';

export interface IndividualClientInfo {
  id: string;
  name: string;
  createdDate?: string;
  gender?: boolean;
  DOB: string;
  email: string;
  salesman?: {
    id: string;
    name: string;
  };
  address?: string;
  suburb?: string;
  state?: string;
  country?: string;
  postcode: string;
  occupation?: string;
  employerName?: string;
  annualIncome?: string;
  sourceOfIncome?: string;
  id1front?: string;
  id1back?: string;
  id2front?: string;
  id2back?: string;
  faceImage?: string;
  faceTest?: string;
  purpose?: string;
  receiver: BeneficiaryInfo[]
  unsubscribe?: boolean;
  id1ExpireDate?: string;
  id2ExpireDate?: string;
  signature?: string;
}
export type IndividualClientsResponse = ResponseType<{
  data: IndividualClientInfo[];
  total: number;
}>;
export type IndividualClientsDetailResponse = ResponseType<IndividualClientInfo>;

export interface CompanyClientInfo {
  id: string;
  createdDate?: string;
  name: string;
  email: string;
  ABN_ACN_ARBN: string;
  companyType?: string;
  registeredBusinessAddress?: string;
  principleBusinessAddress?: string;
  companyContactNumber?: string;
  unsubscribe?: boolean;
  salesman?: {
    id: string;
    name: string;
  };
  purpose?: string;
  signature?: string;
  legalPerson1front?: string;
  legalPerson1back?: string;
  legalPerson2front?: string;
  legalPersion2back?: string;
  companyExtract?: string;
  accountHolderName?: string;
  accountHolderPosition?: string;
  accountHolderDOB?: string;
  accountHolderContactNumber?: string;
  accountHolderEmail?: string;
  accountHolderResidentialAddress?: string;
  person1ExpireDate?: string;
  person2ExpireDate?: string;
}
export type CompanyClientsResponse = ResponseType<{
  data: CompanyClientInfo[];
  total: number;
}>;
export type CompanyClientsDetailResponse = ResponseType<CompanyClientInfo>;

export interface BeneficiaryInfo {
  id: string;
  createdDate: string;
  individualClient?: string;
  companyClient?: string;
  name?: string;
  DOB?: string;
  receiverType: boolean;
  address?: string;
  suburb?: string;
  state?: string;
  country?: string;
  postcode?: string;
  phone?: string;
  occupation?: string;
  relationship?: string;
  bankName: string;
  branchName: string;
  accountName: string;
  accountNumber: number;
  bsb: number;
  isTrustAccount?: boolean;
  idFront?: string;
  idBack?: string;
  relatedDoc?: string;
  idExpireDate?: string;
  trustAccountCompanyName?: string;
  trustAccountCompanyAddress?: string;
  trustAccountCompanyABN?: number;
}
export type BeneficiaryResponse = ResponseType<{
  data: BeneficiaryInfo[];
  total: number;
}>;
export type BeneficiaryDetailResponse = ResponseType<BeneficiaryInfo>;

export function getIndividualClients(current: number, pageSize: number) {
  return request<IndividualClientsResponse>('/api/individualclients', {
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
export function addIndividualClient(data: FormData) {
  return request<NoDataResponse>(`/api/individualclient`, {
    method: 'post',
    body: data,
  });
}
export function deleteIndividualClient(id: string) {
  return request<NoDataResponse>(`/api/individualclient/${id}`, {
    method: 'delete',
  });
}

export function updateIndividualClientsDetail(id: string, data: FormData) {
  return request<NoDataResponse>(`/api/individualclient/${id}`, {
    method: 'put',
    body: data,
  });
}

export function getCompanyClients(current: number, pageSize: number) {
  return request<CompanyClientsResponse>('/api/companyclient', {
    method: 'get',
    params: {
      current,
      pageSize,
    },
  });
}

export function getCompanyClientsDetail(id: string) {
  return request<CompanyClientsDetailResponse>(`/api/companyclient/${id}`, {
    method: 'get',
  });
}

export function getSearchBeneficiaries(name: string) {
  return request<BeneficiaryResponse>(
    `/api/receivers?limit=10&offset=0&name=${name}`,
    {
      method: 'get',
    },
  );
}

export function getIndividualBeneficiaries(id: string) {
  return request<BeneficiaryResponse>(
    `/api/individualclient/${id}/receivers?limit=5&offset=0`,
    {
      method: 'get',
    },
  );
}

export function getCompanyBeneficiaries(id: string) {
  return request<BeneficiaryResponse>(`/api/companyclient/${id}/receivers`, {
    method: 'get',
  });
}

export function getBeneficiaryDetail(id: string) {
  return request<BeneficiaryDetailResponse>(`/api/receiver/${id}`, {
    method: 'get',
  });
}
export function updateBeneficiaryDetail(id: string, data: FormData) {
  return request<NoDataResponse>(`/api/receiver/${id}`, {
    method: 'put',
    body: data,
  });
}
export function addBeneficiary(data: FormData) {
  return request<NoDataResponse>(`/api/receiver`, {
    method: 'post',
    body: data,
  });
}
export function deleteBeneficiary(id: string) {
  return request<NoDataResponse>(`/api/receiver/${id}`, {
    method: 'delete',
  });
}
