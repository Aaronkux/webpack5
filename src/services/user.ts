import { request } from 'umi';
export interface OrderUser {
  id: string;
  photo: string;
}

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
      photo: string;
      isActive: boolean;
      isAdmin: boolean;
      checkCompliance: OrderUser;
      checkFundNotified: OrderUser;
      checkFundReceived: OrderUser;
      checkClientComfirmed: OrderUser;
      checkFundPaid: OrderUser;
      clientlistcolumns: [];
      orderlistcolumns: [];
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
