import { request } from 'umi';
import type { NoDataResponse, ResponseType } from './index';

export interface UserInfo {
  id: string;
  name: string;
  photo: string;
  username: string;
  isActive: boolean;
  isAdmin: boolean;
  createdDate: string;
  token: string;

  salesPermission: boolean;
  clientPermission: boolean;
  orderPermission: boolean;
  emailPermission: boolean;
  checkCompliance: boolean;
  checkFundNotified: boolean;
  checkFundReceived: boolean;
  checkClientComfirmed: boolean;
  checkFundPaid: boolean;
}

export type UsersResponse = ResponseType<{data: UserInfo[], total: number}>;
export type UserDetailResponse = ResponseType<UserInfo>;

export interface UserType {
  name: string;
  email: string;
  access: string[];
}

export function login(username: string, password: string) {
  let formdata = new FormData();
  formdata.append('username', username);
  formdata.append('password', password);
  return request<UserDetailResponse>('/api/auth-token', {
    method: 'post',
    body: formdata,
    
  });
}

export function getUsers(current: number, pageSize: number) {
  return request<UsersResponse>(
    `/api/users?limit=${pageSize}&offset=${(current - 1) * pageSize}`,
    {
      method: 'get',
    },
  );
}

export function getUserDetail(id: string) {
  return request<UserDetailResponse>(`/api/user/${id}`, {
    method: 'get',
  });
}

export function updateUser(id: string, data: FormData) {
  return request<NoDataResponse>(`/api/user/${id}`, {
    method: 'put',
    body: data,
  });
}
export function addUser(data: FormData) {
  return request<NoDataResponse>(`/api/user`, {
    method: 'post',
    body: data,
  });
}

export function deleteUser(id: string) {
  return request<NoDataResponse>(`/api/user/${id}`, {
    method: 'delete',
  });
}
