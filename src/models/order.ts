import { Effect, ImmerReducer } from 'umi';
import {
  getOrderDetail,
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from '@/services/order';
import type {
  OrderDetailResponse,
  OrderInfo,
  OrdersResponse,
  OrderAddResponse,
  OrderUpdateResponse,
  OrderDeleteResponse,
} from '@/services/order';

import { message } from 'antd';

export interface OrderModelState {
  orders: OrderInfo[];
  detail?: OrderInfo;
  total: number;
}

export interface OrderModelType {
  namespace: 'orders';
  state: OrderModelState;
  effects: {
    getOrders: Effect;
    getOrderDetail: Effect;
    addOrder: Effect;
    updateOrder: Effect;
    deleteOrder: Effect;
  };
  reducers: {
    save: ImmerReducer<OrderModelState>;
  };
}

const OrderModel: OrderModelType = {
  namespace: 'orders',
  state: { orders: [], total: 0 },
  effects: {
    *getOrders({ payload }, { call, put }) {
      const { current, pageSize } = payload;
      const res: OrdersResponse = yield call(getOrders, current, pageSize);
      if (res.success && res.data) {
        yield put({ type: 'save', payload: res.data });
      }
    },
    *getOrderDetail({ payload }, { call, put }) {
      const { id } = payload;
      const res: OrderDetailResponse = yield call(getOrderDetail, id);
      if (res.success && res.data) {
        yield put({ type: 'save', payload: { detail: res.data } });
      } else {
        message.warning('Updated Failed');
      }
    },
    *addOrder({ payload }, { call }) {
      const res: OrderAddResponse = yield call(addOrder, payload);
      if (res.success) {
        message.success('Record Updated');
        return true;
      } else {
        message.warning('Updated Failed');
        return false;
      }
    },
    *updateOrder({ payload }, { call, put }) {
      const { id, fields } = payload;
      const res: OrderUpdateResponse = yield call(updateOrder, id, fields);
      if (res.success) {
        message.success('Record Updated');
      } else {
        message.warning('Updated Failed');
      }
    },
    *deleteOrder({ payload }, { call, put }) {
      const { id } = payload;
      const res: OrderDeleteResponse = yield call(deleteOrder, id);
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

export default OrderModel;
