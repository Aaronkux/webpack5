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
  Switch,
  Divider,
} from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import Avatar from '@/components/Avatar';
import styles from './Create.less';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

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
  const [orderChecked, setOrderChecked] = useState(false);
  const finishHandler = async (values: any) => {
    setAdding(true);
    const res = await request('/api/users', {
      method: 'post',
      data: values,
    });
    if (res.success) message.success('Add Successfully');
    setAdding(false);
    form.resetFields();
    setNewVisible(false);
  };

  const valueChangedHandler = (changedValues: any, allValues: any) => {
    const { isAdmin, orderPermission } = changedValues;
    if (isAdmin === true) {
      console.log('triied');
      form.setFieldsValue({
        salesPermission: true,
        clientPermission: true,
        orderPermission: true,
        emailPermission: true,
        checkCompliance: true,
        checkFundNotified: true,
        checkFundReceived: true,
        checkClientComfirmed: true,
        checkFundPaid: true,
      });
    }
    if (orderPermission === false) {
      form.setFieldsValue({
        checkCompliance: false,
        checkFundNotified: false,
        checkFundReceived: false,
        checkClientComfirmed: false,
        checkFundPaid: false,
      });
    }
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
        onValuesChange={valueChangedHandler}
      >
        <h1 className={styles.title}>Basic</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter name!' }]}
              required
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please select email!' }]}
              required
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Is Active"
              name="isActive"
              initialValue={true}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Photo" name="photo">
              <Avatar />
            </Form.Item>
          </Col>
        </Row>
        <h1 className={styles.title}>Permissions</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Is Admin"
              name="isAdmin"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Sales Permission"
              name="salesPermission"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Client Permission"
              name="clientPermission"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Email Permission"
              name="emailPermission"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Order Permission"
              name="orderPermission"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                onChange={(checked: boolean) => setOrderChecked(checked)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>
        <h1 className={styles.title}>Order Check</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Check Compliance"
                name="checkCompliance"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!orderChecked}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Check FundNotified"
                name="checkFundNotified"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!orderChecked}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Check FundReceived"
                name="checkFundReceived"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!orderChecked}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Check ClientComfirmed"
                name="checkClientComfirmed"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!orderChecked}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Check FundPaid"
                name="checkFundPaid"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!orderChecked}
                />
              </Form.Item>
            </Col>
          </Row>
      </Form>
    </Modal>
  );
}
