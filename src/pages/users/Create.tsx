import React, { useState } from 'react';
import { useRequest } from 'umi';
import { Modal, Form, Input, Row, Col, message, Switch, Divider } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { CloseCircleOutlined } from '@ant-design/icons';
import { addUser } from '@/services/users';
import type { UserInfo } from '@/services/users';
import { createFormData, imageFileProcesser } from '@/utils';
import AuthAndEditAvatar from '@/components/AuthAndEditAvatar';
import styles from './Create.less';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

interface PropsType {
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUsers: () => void;
}

type FormSaleInfo = Partial<UserInfo>;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export default function Create({
  newVisible,
  setNewVisible,
  fetchUsers,
}: PropsType) {
  const [form] = Form.useForm();
  const [orderChecked, setOrderChecked] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const { loading: adding, run } = useRequest(addUser, {
    manual: true,
    onSuccess: () => {
      message.success('Add Successfully');
      fetchUsers();
      onCancelHandler();
    },
  });
  const finishHandler = async (values: FormSaleInfo) => {
    const { photo } = values;
    const tempData = {
      ...values,
      ...{
        photo: imageFileProcesser(photo),
      },
    };

    run(createFormData(tempData));
  };

  const onCancelHandler = () => {
    form.resetFields();
    setNewVisible(false);
  };

  const valueChangedHandler = (changedValues: any, allValues: any) => {
    const { isAdmin, orderPermission } = changedValues;
    if (isAdmin === true) {
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
        checkConfirmationSent: true,
      });
      setOrderChecked(true);
      setAdminChecked(true);
    } else {
      setAdminChecked(false);
    }
    if (orderPermission === false) {
      form.setFieldsValue({
        checkCompliance: false,
        checkFundNotified: false,
        checkFundReceived: false,
        checkClientComfirmed: false,
        checkFundPaid: false,
        checkConfirmationSent: false,
      });
    }
  };
  return (
    <Modal
      visible={newVisible}
      width={1300}
      onCancel={onCancelHandler}
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
              rules={[{ required: true, message: 'Please enter your name!' }]}
              required
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Email"
              name="username"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Please enter your email!',
                },
              ]}
              required
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' },
              ]}
              required
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Is Active"
              name="isActive"
              valuePropName="checked"
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
              <AuthAndEditAvatar />
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
                disabled={adminChecked}
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
                disabled={adminChecked}
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
                disabled={adminChecked}
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
                disabled={adminChecked}
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
                disabled={!orderChecked || adminChecked}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Check FundNotified"
              name="checkFundNotified"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                disabled={!orderChecked || adminChecked}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Check FundReceived"
              name="checkFundReceived"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                disabled={!orderChecked || adminChecked}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Check ConfirmationSent"
              name="checkConfirmationSent"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                disabled={!orderChecked || adminChecked}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Check ClientComfirmed"
              name="checkClientComfirmed"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                disabled={!orderChecked || adminChecked}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Check FundPaid"
              name="checkFundPaid"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                disabled={!orderChecked || adminChecked}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
