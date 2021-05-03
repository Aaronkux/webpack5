import { request } from 'umi';
import type { ResponseType } from './index';

export interface UserInfo {
  id: string;
  name: string;
  photo: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  create_date: string;
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

export type UsersResponse = ResponseType<{ users: UserInfo[]; total: number }>;
export type UserDetailResponse = ResponseType<UserInfo>;

export type UserUpdateResponse = ResponseType<{}>;
export type UserAddResponse = ResponseType<{}>;
export type UserDeleteResponse = ResponseType<{}>;

export interface UserType {
  name: string;
  email: string;
  access: string[];
}

export function login(username?: string, password?: string) {
  return request<UserDetailResponse>('/api/login', {
    method: 'post',
    body: JSON.stringify({ username, password }),
  });
}

export function getUsers() {
  return request<UsersResponse>('/api/users', {
    method: 'get',
  });
}

export function getUserDetail(id: string) {
  return request<UserDetailResponse>(`/api/users/${id}`, {
    method: 'get',
  });
}

export function updateUser(id: string, fields: Partial<UserInfo>) {
  return request<UserUpdateResponse>(`/api/users/${id}`, {
    method: 'put',
    data: fields,
  });
}
export function addUser(fields: Partial<UserInfo>) {
  return request<UserAddResponse>(`/api/users`, {
    method: 'put',
    data: fields,
  });
}

export function deleteUser(id: string) {
  return request<UserDeleteResponse>(`/api/users/${id}`, {
    method: 'delete',
  });
}
