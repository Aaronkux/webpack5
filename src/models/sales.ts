import { Effect, ImmerReducer, Subscription } from 'umi';
import { queryAllSales } from '@/services/sales';

export interface SalesModelState {
  id: number;
  name: string;
  email: string;
  photo: string;
  isActive: boolean;
}

export interface QueryAllSalesType {
  current: number;
  pageSize: number;
}

export interface IndexModelType {
  namespace: 'sales';
  state: SalesModelState[];
  effects: {
    query: Effect;
    queryAll: Effect;
  };
  reducers: {
    save: ImmerReducer<SalesModelState>;
  };
  subscriptions: { setup: Subscription };
}

const IndexModel: IndexModelType = {
  namespace: 'sales',
  state: [],
  effects: {
    *query({ payload }, { call, put }) {},
    *queryAll({ payload }, { call, put }) {
      const { current = 0, pageSize = 8 } = payload;
      const res = yield call(queryAllSales, current, pageSize);
    },
  },
  reducers: {
    save(state, action) {
      state.name = action.payload;
    },
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({
        type: 'queryAll',
        payload: {}
      });
      // return history.listen(({ pathname }) => {
      //   if (pathname === '/') {
      //     dispatch({
      //       type: 'query',
      //     });
      //   }
      // });
    },
  },
};

export default IndexModel;
