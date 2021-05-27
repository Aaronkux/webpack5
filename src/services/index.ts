import type { ErrorShowType } from 'umi';
export interface ResponseType<T> {
  success: boolean;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
  showType?: ErrorShowType;
}

export type NoDataResponse = {}
