import { Effect, ImmerReducer, Subscription } from 'umi';
import { queryAllSales } from '@/services/sales';
import type { SalesResponse, SalesInfo } from '@/services/sales';

export interface SalesModelState {
  sales: SalesInfo[];
  total: number;
}

export interface QueryAllSalesType {
  current: number;
  pageSize: number;
}

export interface SalesModelType {
  namespace: 'sales';
  state: SalesModelState;
  effects: {
    queryAll: Effect;
  };
  reducers: {
    save: ImmerReducer<SalesModelState>;
  };
  // subscriptions: { setup: Subscription };
}

const SalesModel: SalesModelType = {
  namespace: 'sales',
  state: { sales: [], total: 0 },
  effects: {
    *queryAll({ payload }, { call, put }) {
      const { current = 1, pageSize = 8 } = payload;
      const res: SalesResponse = yield call(queryAllSales, current, pageSize);
      if (res.success && res.data) {
        yield put({ type: 'save', payload: res.data });
      }
    },
  },
  reducers: {
    save(state, action) {
      state = action.payload;
      return state;
    },
  },
};

export default SalesModel;
