import { request } from 'umi';

export interface UserInfo {
  data: {
    users: {
      firstname: string;
      lastname: string;
      email: string;
      salesPermission: boolean;
      clientPermission: boolean;
      orderPermission: boolean;
      emailPermission: boolean;
      token: string;
    };
  };
  errorMessage?: string;
  success: boolean;
}

export interface UserType {
  firstname: string;
  lastname: string;
  email: string;
  access: string[];
}

export function login(username?: string, password?: string) {
  return request<UserInfo>('/api/login', {
    method: 'post',
    body: JSON.stringify({ username, password }),
  });
}
