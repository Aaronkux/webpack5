import { Effect, ImmerReducer } from 'umi';
import {
  queryAllIndividualClients,
  queryIndividualClientDetail,
  queryAllBeneficiary,
  queryBeneficiaryDetail,
} from '@/services/clients';
import type {
  IndividualClientInfo,
  IndividualClientsResponse,
  IndividualClientsDetailResponse,
  BeneficiaryInfo,
  BeneficiaryResponse,
  BeneficiaryDetailResponse,
} from '@/services/clients';

export interface ClientsModelState {
  individualClients: { clients: IndividualClientInfo[]; total: number };
  individualClientDetail?: IndividualClientInfo;
  beneficiary: BeneficiaryInfo[];
  beneficiaryDetail?: BeneficiaryInfo;
}

export interface QueryAllSalesType {
  current: number;
  pageSize: number;
}

export interface ClientsModelType {
  namespace: 'clients';
  state: ClientsModelState;
  effects: {
    queryIndividualClients: Effect;
    queryIndividualClientDetail: Effect;
    queryAllBeneficiary: Effect;
    queryBeneficiaryDetail: Effect;
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
    beneficiary: [],
  },
  effects: {
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
    *queryAllBeneficiary({ payload }, { call, put }) {
      const { id } = payload;
      const res: BeneficiaryResponse = yield call(queryAllBeneficiary, id);
      if (res.success && res.data) {
        yield put({
          type: 'save',
          payload: { beneficiary: res.data },
        });
      }
    },
    *queryBeneficiaryDetail({ payload }, { call, put }) {
      const { id } = payload;
      const res: BeneficiaryDetailResponse = yield call(
        queryBeneficiaryDetail,
        id,
      );
      if (res.success && res.data) {
        yield put({
          type: 'save',
          payload: { beneficiaryDetail: res.data },
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
