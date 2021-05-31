import React, { useEffect, useState } from 'react';
import { useRouteMatch, useRequest } from 'umi';
import {
  Form,
  Card,
  message,
  Skeleton,
  Modal,
  Row,
  Col,
  Button,
  Divider,
  Switch,
  Input,
} from 'antd';
import AuthImg from '@/components/AuthImg';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import BackButton from '@/components/BackButton';
import NormalText from '@/components/NormalText';
import AuthAndEditAvatar from '@/components/AuthAndEditAvatar';
import type { UserInfo } from '@/services/users';
import { updateUser, getUserDetail } from '@/services/users';
import { createFormData, isBlob } from '@/utils';
import styles from './Detail.less';

const imageFileProcesser = (file: any) => {
  if (isBlob(file)) {
    return file;
  } else {
    return undefined;
  }
};

type FormSaleInfo = Partial<UserInfo>;

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 19 },
};

const Detail = () => {
  const match = useRouteMatch<{ id?: string }>();
  const { id } = match.params;
  // need reset Fields after fetch request, but this will cause double render if we put reset in onSuccess, so I made a custom loading here
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { data, run: runGetUserDetail } = useRequest(getUserDetail, {
    manual: true,
    onSuccess: (data) => {
      form.resetFields();
      if (data?.orderPermission) {
        setOrderChecked(data?.orderPermission);
      }
      setLoading(false);
    },
  });

  const getUserDetailRequest = () => {
    if (id) {
      setLoading(true);
      runGetUserDetail(id);
    }
  };

  const { loading: saving, run: runUpdateUserDetail } = useRequest(updateUser, {
    manual: true,
    onSuccess: () => {
      message.success('Update Successfully!');
      setEditing(false);
      getUserDetailRequest();
    },
  });
  const [editing, setEditing] = useState(false);
  const [orderChecked, setOrderChecked] = useState(
    data?.orderPermission ?? false,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const finishHandler = async (values: FormSaleInfo) => {
    if (!id) {
      message.error(`Can't Find Id Of The User!`);
      return;
    }
    const { photo } = values;
    const tempData = {
      ...values,
      ...{
        photo: imageFileProcesser(photo),
      },
    };
    runUpdateUserDetail(id, createFormData(tempData));
  };

  const valueChangedHandler = (changedValues: any) => {
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
      });
      setOrderChecked(true);
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

  useEffect(() => {
    if (id) {
      getUserDetailRequest();
    }
  }, [id]);
  return (
    <Card>
      <BackButton />
      {!loading ? (
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={finishHandler}
          onValuesChange={valueChangedHandler}
        >
          <div className={styles.titleAndButton}>
            <h1 className={styles.title}>Basic</h1>
            <Row gutter={[16, 0]} justify="end">
              {editing ? (
                <Col>
                  <Form.Item>
                    <Button loading={saving} type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}

              <Col>
                {editing ? (
                  <Button type="primary" onClick={() => setModalVisible(true)}>
                    Cancel
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                )}
              </Col>
            </Row>
          </div>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Name"
                name="name"
                initialValue={data?.name}
                required
                rules={[{ required: true, message: 'Please enter your name!' }]}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Email"
                name="username"
                initialValue={data?.username}
                rules={[
                  { required: true, message: 'Please enter your email!' },
                ]}
                required
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="IsActive"
                name="isActive"
                valuePropName="checked"
                initialValue={data?.isActive}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Photo" name="photo" initialValue={data?.photo}>
                <AuthAndEditAvatar disabled={!editing} />
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
                initialValue={data?.isAdmin}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Sales Permission"
                name="salesPermission"
                valuePropName="checked"
                initialValue={data?.salesPermission}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Client Permission"
                name="clientPermission"
                valuePropName="checked"
                initialValue={data?.clientPermission}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Email Permission"
                name="emailPermission"
                valuePropName="checked"
                initialValue={data?.emailPermission}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Order Permission"
                name="orderPermission"
                valuePropName="checked"
                initialValue={data?.orderPermission}
              >
                <Switch
                  onChange={(checked: boolean) => setOrderChecked(checked)}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing}
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
                initialValue={data?.checkCompliance}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing || !orderChecked}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Check FundNotified"
                name="checkFundNotified"
                valuePropName="checked"
                initialValue={data?.checkFundNotified}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing || !orderChecked}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Check FundReceived"
                name="checkFundReceived"
                valuePropName="checked"
                initialValue={data?.checkFundReceived}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing || !orderChecked}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Check ClientComfirmed"
                name="checkClientComfirmed"
                valuePropName="checked"
                initialValue={data?.checkClientComfirmed}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing || !orderChecked}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Check FundPaid"
                name="checkFundPaid"
                valuePropName="checked"
                initialValue={data?.checkFundPaid}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing || !orderChecked}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]} justify="end">
            {editing ? (
              <Col>
                <Form.Item>
                  <Button loading={saving} type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Col>
            ) : (
              ''
            )}

            <Col>
              {editing ? (
                <Button type="primary" onClick={() => setModalVisible(true)}>
                  Cancel
                </Button>
              ) : (
                <Button type="primary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
            </Col>
          </Row>
        </Form>
      ) : (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      )}
      <Modal
        centered
        title="Unsaved confirm"
        visible={modalVisible}
        onOk={() => {
          form.resetFields();
          setEditing(false);
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      >
        <p>All unsaved changes will be discharged.</p>
      </Modal>
    </Card>
  );
};

export default React.memo(Detail);
