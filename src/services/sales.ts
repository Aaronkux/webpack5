import { request, ErrorShowType } from 'umi';
import type { ResponseType } from './index';

interface SalesResponse {
  id: number;
  name: string;
  email: string;
  photo: string;
  isActive: boolean;
}

export async function queryAllSales(current: number, pageSize: number) {
  const res = await request<ResponseType<SalesResponse[]>>('/api/sales', {
    method: 'get',
    params: {
      current,
      pageSize,
    },
  });
  console.log(res);
}
