import { request } from 'umi';

export function initialState() {
  return request('/api/initialState');
}
