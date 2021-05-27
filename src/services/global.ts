import { request } from 'umi';

export function getImg(path: string) {
  return request<Blob>(`/api${path}`, {
    method: 'get',
    responseType: 'blob',
  });
}
