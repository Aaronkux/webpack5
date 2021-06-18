import { request } from 'umi';
import type { ResponseType, NoDataResponse } from './index';
import type { SalesInfo } from './sales';

export interface IndividualClientInfo {
  id: string;
  name: string;
  createdDate?: string;
  gender?: boolean;
  DOB: string;
  email: string;
  salesman?: SalesInfo;
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
  receiver: BeneficiaryInfo[];
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
  salesman?: SalesInfo;
  registeredBusinessAddress?: string;
  principleBusinessAddress?: string;
  companyContactNumber?: string;
  unsubscribe?: boolean;
  purpose?: string;
  signature?: string;
  legalPerson1front?: string;
  legalPerson1back?: string;
  legalPerson2front?: string;
  legalPerson2back?: string;
  companyExtract?: string;
  accountHolderName?: string;
  accountHolderPosition?: string;
  accountHolderDOB?: string;
  accountHolderContactNumber?: string;
  accountHolderEmail?: string;
  accountHolderResidentialAddress?: string;
  person1ExpireDate?: string;
  person2ExpireDate?: string;
  receiver: BeneficiaryInfo[];
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
      limit: pageSize,
      offset: (current - 1) * pageSize,
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
export function getCompanyClientsDetail(id: string) {
  return request<CompanyClientsDetailResponse>(`/api/companyclient/${id}`, {
    method: 'get',
  });
}
export function addIndividualClient(data: FormData) {
  return request<NoDataResponse>(`/api/individualclient`, {
    method: 'post',
    body: data,
  });
}
export function addCompanyClient(data: FormData) {
  return request<NoDataResponse>(`/api/companyclient`, {
    method: 'post',
    body: data,
  });
}
export function deleteIndividualClient(id: string) {
  return request<NoDataResponse>(`/api/individualclient/${id}`, {
    method: 'delete',
  });
}

export function deleteCompanyClient(id: string) {
  return request<NoDataResponse>(`/api/companyclient/${id}`, {
    method: 'delete',
  });
}

export function updateIndividualClientsDetail(id: string, data: FormData) {
  return request<NoDataResponse>(`/api/individualclient/${id}`, {
    method: 'put',
    body: data,
  });
}
export function updateCompanyClientsDetail(id: string, data: FormData) {
  return request<NoDataResponse>(`/api/companyclient/${id}`, {
    method: 'put',
    body: data,
  });
}

export function getCompanyClients(current: number, pageSize: number) {
  return request<CompanyClientsResponse>('/api/companyclients', {
    method: 'get',
    params: {
      limit: pageSize,
      offset: (current - 1) * pageSize,
    },
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
  return request<BeneficiaryResponse>(`/api/individualclient/${id}/receivers`, {
    method: 'get',
    params: {
      limit: 5,
      offset: 0,
    },
  });
}

export function getCompanyBeneficiaries(id: string) {
  return request<BeneficiaryResponse>(`/api/companyclient/${id}/receivers`, {
    method: 'get',
    params: {
      limit: 5,
      offset: 0,
    },
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

type CommonClientsResponse = ResponseType<{
  data: {
    id: string;
    name: string;
    receiver: BeneficiaryInfo[];
  }[];
  total: number;
}>;

export function getClients(clientType: string, name: string) {
  return request<CommonClientsResponse>(
    `/api/${clientType}?limit=10&offset=0`,
    {
      method: 'get',
      params: {
        name,
      },
    },
  );
}
