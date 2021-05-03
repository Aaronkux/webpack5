import { Effect, ImmerReducer } from 'umi';
import {
  getUserDetail,
  getUsers,
  updateUser,
  deleteUser,
} from '@/services/users';
import type {
  UserDetailResponse,
  UserInfo,
  UsersResponse,
  UserUpdateResponse,
  UserDeleteResponse,
} from '@/services/users';

import { message } from 'antd';

export interface UsersModelState {
  users: UserInfo[];
  detail?: UserInfo;
  total: number;
}

export interface UsersModelType {
  namespace: 'users';
  state: UsersModelState;
  effects: {
    getUsers: Effect;
    getUserDetail: Effect;
    updateUser: Effect;
    deleteUser: Effect;
  };
  reducers: {
    save: ImmerReducer<UsersModelState>;
  };
}

const SalesModel: UsersModelType = {
  namespace: 'users',
  state: { users: [], total: 0 },
  effects: {
    *getUsers({ payload }, { call, put }) {
      const { current, pageSize } = payload;
      const res: UsersResponse = yield call(getUsers, current, pageSize);
      if (res.success && res.data) {
        yield put({ type: 'save', payload: res.data });
      }
    },
    *getUserDetail({ payload }, { call, put }) {
      const { id } = payload;
      const res: UserDetailResponse = yield call(getUserDetail, id);
      if (res.success && res.data) {
        yield put({ type: 'save', payload: { detail: res.data } });
      } else {
        message.warning('Updated Failed');
      }
    },
    *updateUser({ payload }, { call, put }) {
      const { id, fields } = payload;
      const res: UserUpdateResponse = yield call(updateUser, id, fields);
      if (res.success) {
        message.success('Record Updated');
      } else {
        message.warning('Updated Failed');
      }
    },
    *deleteUser({ payload }, { call, put }) {
      const { id } = payload;
      const res: UserDeleteResponse = yield call(deleteUser, id);
      if (res.success) {
        message.success('Record Deleted');
      } else {
        message.warning('Delete Failed');
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

export default SalesModel;
