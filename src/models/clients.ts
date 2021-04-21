import { Effect, ImmerReducer, Subscription } from 'umi';
import { queryAllIndividualClients, queryIndividualClientDetail } from '@/services/clients';
import type {
  IndividualClientInfo,
  IndividualClientsResponse,
  IndividualClientsDetailResponse,
} from '@/services/clients';

export interface ClientsModelState {
  individualClients: { clients: IndividualClientInfo[]; total: number };
  individualClientDetail?: IndividualClientInfo;
}

export interface QueryAllSalesType {
  current: number;
  pageSize: number;
}

export interface ClientsModelType {
  namespace: 'clients';
  state: ClientsModelState;
  effects: {
    query: Effect;
    queryIndividualClients: Effect;
    queryIndividualClientDetail: Effect;
  };
  reducers: {
    save: ImmerReducer<ClientsModelState>;
  };
  // subscriptions: { setup: Subscription };
}

const ClientsModel: ClientsModelType = {
  namespace: 'clients',
  state: {
    individualClients: {
      clients: [],
      total: 0,
    },
  },
  effects: {
    *query({ payload }, { call, put }) {},
    *queryIndividualClients({ payload }, { call, put }) {
      const { current, pageSize } = payload;
      const res: IndividualClientsResponse = yield call(
        queryAllIndividualClients,
        current,
        pageSize,
      );
      if (res.success && res.data) {
        yield put({ type: 'save', payload: { individualClients: res.data } });
      }
    },
    *queryIndividualClientDetail({ payload }, { call, put }) {
      const { id } = payload;
      const res: IndividualClientsDetailResponse = yield call(
        queryIndividualClientDetail,
        id,
      );
      if (res.success && res.data) {
        yield put({
          type: 'save',
          payload: { individualClientDetail: res.data },
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      state = { ...state, ...action.payload };
      return state;
    },
  },
};

export default ClientsModel;
