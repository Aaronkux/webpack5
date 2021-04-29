import { Effect, ImmerReducer } from 'umi';
import {
  getIndividualClients,
  getIndividualClientsDetail,
  getBeneficiaries,
  getBeneficiaryDetail,
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
    getIndividualClients: Effect;
    getIndividualClientsDetail: Effect;
    getBeneficiaries: Effect;
    getBeneficiaryDetail: Effect;
  };
  reducers: {
    save: ImmerReducer<ClientsModelState>;
  };
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
    *getIndividualClients({ payload }, { call, put }) {
      const { current, pageSize } = payload;
      const res: IndividualClientsResponse = yield call(
        getIndividualClients,
        current,
        pageSize,
      );
      if (res.success && res.data) {
        yield put({ type: 'save', payload: { individualClients: res.data } });
      }
    },
    *getIndividualClientsDetail({ payload }, { call, put }) {
      const { id } = payload;
      const res: IndividualClientsDetailResponse = yield call(
        getIndividualClientsDetail,
        id,
      );
      if (res.success && res.data) {
        yield put({
          type: 'save',
          payload: { individualClientDetail: res.data },
        });
      }
    },
    *getBeneficiaries({ payload }, { call, put }) {
      const { id } = payload;
      const res: BeneficiaryResponse = yield call(getBeneficiaries, id);
      if (res.success && res.data) {
        yield put({
          type: 'save',
          payload: { beneficiary: res.data },
        });
      }
    },
    *getBeneficiaryDetail({ payload }, { call, put }) {
      const { id } = payload;
      const res: BeneficiaryDetailResponse = yield call(
        getBeneficiaryDetail,
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
