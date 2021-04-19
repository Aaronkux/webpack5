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

export interface IndexModelType {
  namespace: 'sales';
  state: SalesModelState;
  effects: {
    query: Effect;
    queryAll: Effect;
  };
  reducers: {
    save: ImmerReducer<SalesModelState>;
  };
  // subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'sales',
  state: { sales: [], total: 0 },
  effects: {
    *query({ payload }, { call, put }) {},
    *queryAll({ payload }, { call, put }) {
      const { current, pageSize } = payload;
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
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     dispatch({
  //       type: 'queryAll',
  //       payload: {},
  //     });
  //   },
  // },
};

export default IndexModel;
