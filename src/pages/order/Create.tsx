import React, { useState } from 'react';
import { useDispatch, connect } from 'umi';
import type { Loading } from 'umi';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
  Divider,
} from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styles from './Create.less';

const { Option } = Select;
const { TextArea } = Input;

interface PropsType {
  newVisible: boolean;
  addLoading: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

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

const mockClients = [
  { id: '1', name: 'test1', amount: 0 },
  { id: '2', name: 'test2', amount: 0 },
];

let objMockClients: any = {};
for (let i of mockClients) {
  objMockClients[i.id] = i;
}

const Create = ({ newVisible, setNewVisible, addLoading }: PropsType) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState<{
    [prop: string]: {
      id: string;
      name: string;
      amount: number;
    };
  }>({});
  const [receivers, setReceivers] = useState<{
    [prop: string]: {
      id: string;
      name: string;
      amount: number;
    };
  }>({});
  const dispatch = useDispatch();

  const finishHandler = async (values: any) => {
    const { clientType, client, ...rest } = values;
    let clientInfo: any = {};
    switch (clientType) {
      case 'individual':
        clientInfo['individualClient'] = client;
        break;
      case 'company':
        clientInfo['companyClient'] = client;
        break;
    }
    const res = await dispatch({
      type: 'orders/addOrder',
      payload: { ...rest, ...clientInfo },
    });
  };

  const onSelectHandler = (id: string) => {
    if (!clients[id]) {
      setClients({ ...clients, ...{ [id]: objMockClients[id] } });
    }
  };

  const onDeselectHandler = (id: string) => {
    const { [id]: omitItem, ...rest } = clients;
    setClients(rest);
  };

  const onInputChangeHandler = (amount: number, id: string) => {
    setClients({
      ...clients,
      ...{ [id]: { id, name: clients[id].name, amount } },
    });
  };

  console.log(clients)

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
              name="clientType"
              rules={[
                { required: true, message: 'Please select client type!' },
              ]}
              required
            >
              <Select>
                <Option value={'individual'}>Individual</Option>
                <Option value={'company'}>Company</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Client"
              name="client"
              rules={[{ required: true, message: 'Please select client!' }]}
              required
            >
              <Select
                onSearch={(val) => console.log(val)}
                showSearch
                mode="multiple"
                optionFilterProp="children"
                onSelect={onSelectHandler}
                onDeselect={onDeselectHandler}
              >
                {mockClients.map((v) => (
                  <Option value={v.id}>{v.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
          {Object.values(clients).map((item) => (
            <Col
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
              name="receiver"
              rules={[{ required: true, message: 'Please select receiver!' }]}
              required
            >
              <Select>
                <Option value={'113213'}>Aaron</Option>
                <Option value={'212321412'}>Loorn</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Exchange Rate"
              name="exchangeRate"
              rules={[
                { required: true, message: 'Please input exchangeRate!' },
              ]}
              required
            >
              <InputNumber style={{ width: '100%' }} precision={2} step="1" />
            </Form.Item>
          </Col>
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
              rules={[{ required: true, message: 'Please input amount!' }]}
              required
            >
              <InputNumber
                style={{ width: '100%' }}
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                precision={2}
                step="1"
                stringMode
              />
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
              rules={[{ required: true, message: 'Please input amount!' }]}
              required
            >
              <InputNumber
                style={{ width: '100%' }}
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                precision={2}
                step="1"
                stringMode
              />
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
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                precision={2}
                step="1"
                stringMode
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Salesman" name="salesman">
              <Select>
                <Option value={'113213'}>Aaron</Option>
                <Option value={'212321412'}>Loorn</Option>
              </Select>
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

export default connect(({ loading }: { loading: Loading }) => ({
  addLoading: loading.effects['orders/addOrder']!,
}))(React.memo(Create));
