import { request } from 'umi';

export function login(username?: string, password?: string) {
  return request('/api/login', {
    method: 'post',
  });
}
