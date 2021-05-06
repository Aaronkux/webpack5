import { Effect, ImmerReducer } from 'umi';
import { message } from 'antd';
import {
  getIndividualClients,
  getIndividualClientsDetail,
  getCompanyClients,
  getCompanyClientsDetail,
  getIndividualBeneficiaries,
  getCompanyBeneficiaries,
  getBeneficiaryDetail,
  updateBeneficiaryDetail,
} from '@/services/clients';
import type {
  IndividualClientInfo,
  CompanyClientInfo,
  IndividualClientsResponse,
  CompanyClientsResponse,
  IndividualClientsDetailResponse,
  CompanyClientsDetailResponse,
  BeneficiaryInfo,
  BeneficiaryResponse,
  BeneficiaryDetailResponse,
} from '@/services/clients';

export interface ClientsModelState {
  individualClients: { clients: IndividualClientInfo[]; total: number };
  companyClients: { clients: CompanyClientInfo[]; total: number };
  individualClientDetail?: IndividualClientInfo;
  companyClientDetail?: CompanyClientInfo;
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
    getCompanyClients: Effect;
    getCompanyClientsDetail: Effect;
    getIndividualBeneficiaries: Effect;
    getCompanyBeneficiaries: Effect;
    getBeneficiaryDetail: Effect;
    updateBeneficiaryDetail: Effect;
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
    companyClients: {
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
    *getCompanyClients({ payload }, { call, put }) {
      const { current, pageSize } = payload;
      const res: CompanyClientsResponse = yield call(
        getCompanyClients,
        current,
        pageSize,
      );
      if (res.success && res.data) {
        yield put({ type: 'save', payload: { companyClients: res.data } });
      }
    },
    *getCompanyClientsDetail({ payload }, { call, put }) {
      const { id } = payload;
      const res: CompanyClientsDetailResponse = yield call(
        getCompanyClientsDetail,
        id,
      );
      if (res.success && res.data) {
        yield put({
          type: 'save',
          payload: { companyClientDetail: res.data },
        });
      }
    },
    *getIndividualBeneficiaries({ payload }, { call, put }) {
      const { id } = payload;
      const res: BeneficiaryResponse = yield call(
        getIndividualBeneficiaries,
        id,
      );
      if (res.success && res.data) {
        yield put({
          type: 'save',
          payload: { beneficiary: res.data },
        });
      }
    },
    *getCompanyBeneficiaries({ payload }, { call, put }) {
      const { id } = payload;
      const res: CompanyClientsDetailResponse = yield call(
        getCompanyBeneficiaries,
        id,
      );
      if (res.success && res.data) {
        yield put({
          type: 'save',
          payload: { companyClientDetail: res.data },
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
    *updateBeneficiaryDetail({ payload }, { call, put }) {
      const { id, data } = payload;
      const res: BeneficiaryDetailResponse = yield call(
        updateBeneficiaryDetail,
        id,
        data,
      );
      if (res.success) {
        message.success('Update Success!');
        yield put({
          type: 'getBeneficiaryDetail',
          payload: {
            id,
          },
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
