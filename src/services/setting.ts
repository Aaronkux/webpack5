import { request } from 'umi';
import type { ResponseType, NoDataResponse } from './index';

interface CurrencySettingInfo {
  id: string;
  CNYAUDBaseRate: number;
  AUDCNYBaseRate: number;
  USDCNYBaseRate: number;
  CNYUSDBaseRate: number;
  AUDUSDBaseRate: number;
  USDAUDBaseRate: number;
  lastModified: string
}

export type SettingResponse = ResponseType<CurrencySettingInfo>;

export function getSetting() {
  return request<SettingResponse>('/api/settings', {
    method: 'get',
  });
}
export function updateSetting(data: FormData) {
  return request<NoDataResponse>('/api/settings', {
    method: 'put',
    body: data,
  });
}
