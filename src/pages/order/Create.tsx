import React, { useState } from 'react';
import { request } from 'umi';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
  message,
} from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styles from './Create.less';

const { Option } = Select;
const { TextArea } = Input;

interface PropsType {
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export default function Create({ newVisible, setNewVisible }: PropsType) {
  const [form] = Form.useForm();
  const [adding, setAdding] = useState(false);
  const finishHandler = async (values: any) => {
    const { clientType, client, receiver } = values;
    let clientInfo: any = {};
    switch (clientType) {
      case 'individual':
        clientInfo['individualClient'] = client;
        break;
      case 'company':
        clientInfo['companyClient'] = client;
        break;
    }

    setAdding(true);
    const res = await request('/api/order', {
      method: 'post',
      data: values,
    });
    if (res.success) message.success('Add Successfully');
    setAdding(false);
    form.resetFields();
    setNewVisible(false);
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
      className={styles.container}
      okText={'Add'}
      cancelText="Cancel"
      confirmLoading={adding}
    >
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={finishHandler}
      >
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
              <Select>
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
            <Form.Item
              label="From Currency"
              name="fromCurrency"
              rules={[{ required: true, message: 'Please choose currency!' }]}
              required
            >
              <Select>
                <Option value={'AUD'}>AUD</Option>
                <Option value={'CNY'}>CNY</Option>
                <Option value={'HKD'}>HKD</Option>
                <Option value={'USD'}>USD</Option>
                <Option value={'MYR'}>MYR</Option>
                <Option value={'NZD'}>NZD</Option>
                <Option value={'GBP'}>GBP</Option>
                <Option value={'EUR'}>EUR</Option>
                <Option value={'JPY'}>JPY</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="From Amount"
              name="fromAmount"
              rules={[{ required: true, message: 'Please input amount!' }]}
              initialValue={0}
              required
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
            <Form.Item
              label="To Currency"
              name="toCurrency"
              rules={[{ required: true, message: 'Please choose currency!' }]}
              required
            >
              <Select>
                <Option value={'AUD'}>AUD</Option>
                <Option value={'CNY'}>CNY</Option>
                <Option value={'HKD'}>HKD</Option>
                <Option value={'USD'}>USD</Option>
                <Option value={'MYR'}>MYR</Option>
                <Option value={'NZD'}>NZD</Option>
                <Option value={'GBP'}>GBP</Option>
                <Option value={'EUR'}>EUR</Option>
                <Option value={'JPY'}>JPY</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="To Amount" name="toAmount" initialValue={0}>
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
            <Form.Item label="Fee Currency" name="feeCurrency">
              <Select>
                <Option value={'AUD'}>AUD</Option>
                <Option value={'CNY'}>CNY</Option>
                <Option value={'HKD'}>HKD</Option>
                <Option value={'USD'}>USD</Option>
                <Option value={'MYR'}>MYR</Option>
                <Option value={'NZD'}>NZD</Option>
                <Option value={'GBP'}>GBP</Option>
                <Option value={'EUR'}>EUR</Option>
                <Option value={'JPY'}>JPY</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Fee Amount" name="feeAmount" initialValue={0}>
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
            <Form.Item
              label="Exchange Rate"
              name="exchangeRate"
              rules={[
                { required: true, message: 'Please input exchangeRate!' },
              ]}
              required
            >
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
}
