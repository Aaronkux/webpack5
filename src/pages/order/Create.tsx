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

const Create = ({ newVisible, setNewVisible, addLoading }: PropsType) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [formState, setFromState] = useState<{
    [prop: string]: any;
  }>({});
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
    console.log({ ...rest, ...clientInfo });
    console.log(res);

    // setAdding(true);
    // const res = await request('/api/order', {
    //   method: 'post',
    //   data: values,
    // });
    // if (res.success) message.success('Add Successfully');
    // setAdding(false);
    // form.resetFields();
    // setNewVisible(false);
  };

  const onFromAmountBlur = () => {
    const fromAmount = parseFloat(form.getFieldValue('fromAmount'));
    const value = fromAmount ? fromAmount : 0;
    setFromState({ ...formState, ...{ fromAmount: value.toFixed(2) } });
  };
  const onToAmountBlur = () => {
    const toAmount = parseFloat(form.getFieldValue('toAmount'));
    const value = toAmount ? toAmount : 0;
    setFromState({ ...formState, ...{ toAmount: value.toFixed(2) } });
  };
  const onExchangeRateBlur = () => {
    const exchangeRate = parseFloat(form.getFieldValue('exchangeRate'));
    const value = exchangeRate ? exchangeRate : 0;
    setFromState({ ...formState, ...{ exchangeRate: value.toFixed(2) } });
  };
  const onFeeAmountBlur = () => {
    const feeAmount = parseFloat(form.getFieldValue('feeAmount'));
    const value = feeAmount ? feeAmount : 0;
    setFromState({ ...formState, ...{ feeAmount: value.toFixed(2) } });
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
                optionFilterProp="children"
                // loading={true}
              >
                <Option value={'113213'}>Aaron</Option>
                <Option value={'212321412'}>Loorn</Option>
              </Select>
            </Form.Item>
          </Col>
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
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Exchange Rate"
              name="exchangeRate"
              rules={[
                { required: true, message: 'Please input exchangeRate!' },
              ]}
              required
            >
              <InputNumber
                value={formState.exchangeRate}
                onBlur={onExchangeRateBlur}
                style={{ width: '100%' }}
                precision={2}
                step="1"
              />
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
              <Select
                onChange={(value: string) =>
                  setFromState({ ...formState, ...{ from: value } })
                }
                value={formState.from}
              >
                {currencies
                  .filter((cur) => !Object.values(formState).includes(cur))
                  .map((cur) => (
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
                value={formState.fromAmount}
                onBlur={onFromAmountBlur}
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
              <Select
                onChange={(value: string) =>
                  setFromState({ ...formState, ...{ to: value } })
                }
                value={formState.to}
              >
                {currencies
                  .filter((cur) => !Object.values(formState).includes(cur))
                  .map((cur) => (
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
                value={formState.toAmount}
                onBlur={onToAmountBlur}
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
              <Select
                onChange={(value: string) =>
                  setFromState({ ...formState, ...{ fee: value } })
                }
                value={formState.fee}
              >
                {[formState.to, formState.from]
                  .filter((value) => value)
                  .map((currency) => (
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
                value={formState.feeAmount}
                onBlur={onFeeAmountBlur}
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
