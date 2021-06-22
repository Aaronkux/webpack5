import React, { useState, useMemo } from 'react';
import { useRequest } from 'umi';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
  Divider,
  message,
} from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import type { BeneficiaryInfo } from '@/services/clients';
import type { OrderInfo } from '@/services/order';
import { addOrder } from '@/services/order';
import { queryAllSalesByName } from '@/services/sales';
import { getClients } from '@/services/clients';
import styles from './Create.less';
import { createFormData } from '@/utils';

const { Option } = Select;
const { TextArea } = Input;

interface PropsType {
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  queryOrders: () => void;
}

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormOrderInfo = Merge<
  Partial<OrderInfo>,
  {
    salesman: string;
    purpose: string;
    other: string;
  }
>;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const currencies = [
  'AUD',
  'CNY',
  'HKD',
  'USD',
  'MYR',
  'NZD',
  'GBP',
  'EUR',
  'JPY',
];

const Create = ({ newVisible, setNewVisible, queryOrders }: PropsType) => {
  const [form] = Form.useForm();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedReceivers, setSelectedReceivers] = useState<string[]>([]);
  const [clientType, setClientType] = useState(0);
  const [clients, setClients] = useState<{
    [prop: string]: {
      id: string;
      name: string;
      receiver: BeneficiaryInfo[];
      amount?: number;
    };
  }>({});

  const [receivers, setReceivers] = useState<{
    [prop: string]: {
      id: string;
      name?: string;
      amount?: number;
    };
  }>({});

  const availableReceivers = useMemo(() => {
    const filterSet = new Set<string>();
    const res = Object.values(clients)
      .map((item) => item.receiver)
      .flat()
      .filter((item) => {
        if (filterSet.has(item.id)) return false;
        filterSet.add(item.id);
        return true;
      });
    const availableReceiverIds = res.map((val) => val.id);
    setSelectedReceivers(
      selectedReceivers.filter((id) => availableReceiverIds.includes(id)),
    );
    let newReceivers: {
      [prop: string]: {
        id: string;
        name?: string;
        amount?: number;
      };
    } = {};
    for (let item of Object.values(receivers)) {
      if (availableReceiverIds.includes(item.id)) {
        newReceivers[item.id] = item;
      }
    }
    setReceivers(newReceivers);
    return res;
  }, [clients]);

  const onCancelHandler = () => {
    form.resetFields();
    setNewVisible(false);
  };

  const { loading: addLoading, run: addAction } = useRequest(addOrder, {
    manual: true,
    onSuccess: () => {
      message.success('Add Successfully');
      queryOrders();
      onCancelHandler();
    },
  });

  const finishHandler = async (values: FormOrderInfo) => {
    let clientInfo: any = {};
    const clientData = JSON.stringify(
      Object.values(clients).map((item) => {
        const { id, amount } = item;
        return { id, amount };
      }),
    );

    const receiverData = JSON.stringify(
      Object.values(receivers).map((item) => {
        const { id, amount } = item;
        return { id, amount };
      }),
    );
    if (clientType) {
      clientInfo['companyClient'] = clientData;
    } else {
      clientInfo['individualClient'] = clientData;
    }
    addAction(
      createFormData({
        ...values,
        ...clientInfo,
        receiver: receiverData,
      }),
    );
  };

  const {
    data: clientData,
    loading: clientLoading,
    mutate,
    run: queryClients,
  } = useRequest(getClients, {
    manual: true,
    formatResult: (res) => {
      return res.data?.data ?? [];
    },
  });

  const onFetchClientsHandler = (name: string) => {
    queryClients(clientType ? 'companyclients' : 'individualclients', name);
  };

  const onSelectHandler = (id: string) => {
    if (!clients[id]) {
      setClients({
        ...clients,
        [id]: clientData?.find((item) => item.id === id)!,
      });
    }
  };

  const onDeselectHandler = (id: string) => {
    const { [id]: omitItem, ...rest } = clients;
    setClients(rest);
  };

  const onInputChangeHandler = (amount: number, id: string) => {
    setClients({
      ...clients,
      [id]: {
        id,
        name: clients[id].name,
        amount,
        receiver: clients[id].receiver,
      },
    });
  };

  const onReceiverSelectHandler = (id: string) => {
    if (!receivers[id]) {
      setReceivers({
        ...receivers,
        [id]: availableReceivers?.find((item) => item.id === id)!,
      });
    }
  };

  const onReceiverDeselectHandler = (id: string) => {
    const { [id]: omitItem, ...rest } = receivers;
    setReceivers(rest);
  };

  const onReceiverInputChangeHandler = (amount: number, id: string) => {
    setReceivers({
      ...receivers,
      [id]: {
        id,
        name: receivers[id].name,
        amount,
      },
    });
  };

  const onClientTypeChangeHandler = (val: number) => {
    //clients
    setClientType(val);
    setClients({});
    setSelectedClients([]);
    mutate([]);

    // receivers
    setReceivers({});
    setSelectedReceivers([]);
  };

  const onClientChangeHandler = (val: string[]) => {
    if (val.length === 0) {
      mutate([]);
    }
    setSelectedClients(val);
  };

  const onReceiverChangeHandler = (val: string[]) => {
    setSelectedReceivers(val);
  };

  return (
    <Modal
      visible={newVisible}
      width={1300}
      onCancel={() => {
        form.resetFields();
        setNewVisible(false);
      }}
      onOk={() => {
        form.submit();
      }}
      closeIcon={<CloseCircleOutlined />}
      maskClosable={false}
      centered
      okText={'Add'}
      cancelText="Cancel"
      confirmLoading={addLoading}
    >
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={finishHandler}
      >
        <h1 className={styles.title}>Create Order</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="ClientType"
              rules={[
                { required: true, message: 'Please select client type!' },
              ]}
              required
            >
              <Select value={clientType} onChange={onClientTypeChangeHandler}>
                <Option value={0}>Individual</Option>
                <Option value={1}>Company</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Client"
              required
              rules={[{ required: true, message: 'Please select client!' }]}
            >
              <Select
                value={selectedClients}
                onChange={onClientChangeHandler}
                onSearch={onFetchClientsHandler}
                loading={clientLoading}
                showSearch
                mode="multiple"
                optionFilterProp="children"
                onSelect={onSelectHandler}
                onDeselect={onDeselectHandler}
              >
                {clientData?.map((v) => (
                  <Option key={v.id} value={v.id}>
                    {v.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
          {Object.values(clients).map((item) => (
            <Col
              key={item.id}
              xs={16}
              sm={16}
              md={16}
              lg={12}
              xl={12}
              offset={6}
              className={styles.test}
            >
              <div className={styles.testContainer}>
                <div className={styles.name}>{item.name}: </div>
                <InputNumber
                  className={styles.input}
                  value={item.amount}
                  onChange={(value) => onInputChangeHandler(value, item.id)}
                />
              </div>
            </Col>
          ))}

          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Receiver"
              rules={[{ required: true, message: 'Please select receiver!' }]}
              required
            >
              <Select
                value={selectedReceivers}
                onChange={onReceiverChangeHandler}
                mode="multiple"
                optionFilterProp="children"
                onSelect={onReceiverSelectHandler}
                onDeselect={onReceiverDeselectHandler}
              >
                {availableReceivers.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
          {Object.values(receivers).map((item) => (
            <Col
              key={item.id}
              xs={16}
              sm={16}
              md={16}
              lg={12}
              xl={12}
              offset={6}
              className={styles.test}
            >
              <div className={styles.testContainer}>
                <div className={styles.name}>{item.name}: </div>
                <InputNumber
                  className={styles.input}
                  value={item.amount}
                  onChange={(value) =>
                    onReceiverInputChangeHandler(value, item.id)
                  }
                />
              </div>
            </Col>
          ))}
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="From Currency"
              name="fromCurrency"
              rules={[
                { required: true, message: 'Please choose currency!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('toCurrency') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`From currency can't be same as to currency!`),
                    );
                  },
                }),
              ]}
              required
            >
              <Select allowClear>
                {currencies.map((cur) => (
                  <Option key={cur} value={cur}>
                    {cur}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="From Amount"
              name="fromAmount"
              initialValue={0}
              rules={[{ required: true, message: 'Please input amount!' }]}
              required
            >
              <InputNumber style={{ width: '100%' }} precision={2} step="1" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="To Currency"
              name="toCurrency"
              rules={[
                { required: true, message: 'Please choose currency!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('fromCurrency') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`To currency can't be same as from currency!`),
                    );
                  },
                }),
              ]}
              required
            >
              <Select allowClear>
                {currencies.map((cur) => (
                  <Option key={cur} value={cur}>
                    {cur}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="To Amount"
              name="toAmount"
              initialValue={0}
              rules={[{ required: true, message: 'Please input amount!' }]}
              required
            >
              <InputNumber style={{ width: '100%' }} precision={2} step="1" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Fee Currency"
              name="feeCurrency"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue('fromCurrency') === value ||
                      getFieldValue('toCurrency') === value
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        `Fee currency must be to currency or from currency!`,
                      ),
                    );
                  },
                }),
              ]}
            >
              <Select allowClear>
                {currencies.map((currency) => (
                  <Option key={currency} value={currency}>
                    {currency}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Fee Amount"
              name="feeAmount"
              initialValue={0}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!parseFloat(value) || getFieldValue('feeCurrency')) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`Fee currency must be selected!`),
                    );
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: '100%' }} precision={2} step="1" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Exchange Rate"
              name="exchangeRate"
              rules={[
                { required: true, message: 'Please input exchangeRate!' },
              ]}
              initialValue={0}
              required
            >
              <InputNumber style={{ width: '100%' }} precision={4} step="1" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Referral" name="referral">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Department" name="department">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Dispensing Bank" name="dispensingBank">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Comments" name="comments">
              <TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Special Consideration"
              name="specialConsideration"
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(Create);
