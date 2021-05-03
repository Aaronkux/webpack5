import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useRouteMatch, request } from 'umi';
import type { UsersModelState, Loading } from 'umi';
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
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import BackButton from '@/components/BackButton';
import NormalText from '@/components/NormalText';
import Avatar from '@/components/Avatar';
import { UserInfo } from '@/services/users';
import styles from './Detail.less';

interface PropsType {
  userDetail?: UserInfo;
  loading: boolean;
}

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 19 },
};

const Detail = ({ userDetail, loading }: PropsType) => {
  const dispatch = useDispatch();
  const match = useRouteMatch<{ id?: string }>();
  const { id } = match.params;
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orderChecked, setOrderChecked] = useState(
    userDetail?.orderPermission ?? false,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const finishHandler = async (values: any) => {
    setSaving(true);
    const res = await request('/api/users', {
      method: 'post',
      data: values,
    });
    if (res.success) message.success('Save Successfully');
    setSaving(false);
    dispatch({
      type: 'users/getUserDetail',
      payload: { id },
    });
    setEditing(false);
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

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'users/getUserDetail',
        payload: { id },
      });
    }
  }, [id]);
  useEffect(() => {
    form.resetFields();
  }, [editing]);

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
                initialValue={userDetail?.name}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Email"
                name="email"
                initialValue={userDetail?.email}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="IsActive"
                name="isActive"
                valuePropName="checked"
                initialValue={userDetail?.isActive}
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
                label="Photo"
                name="photo"
                initialValue={userDetail?.photo}
              >
                <Avatar disabled={!editing} />
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
                initialValue={userDetail?.isAdmin}
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
                initialValue={userDetail?.salesPermission}
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
                initialValue={userDetail?.clientPermission}
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
                initialValue={userDetail?.emailPermission}
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
                initialValue={userDetail?.orderPermission}
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
                initialValue={userDetail?.checkCompliance}
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
                initialValue={userDetail?.checkFundNotified}
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
                initialValue={userDetail?.checkFundReceived}
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
                initialValue={userDetail?.checkClientComfirmed}
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
                initialValue={userDetail?.checkFundPaid}
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  disabled={!editing || !orderChecked}
                />
              </Form.Item>
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

export default connect(
  ({ users, loading }: { users: UsersModelState; loading: Loading }) => ({
    userDetail: users.detail,
    loading: loading.effects['users/getUserDetail']!,
  }),
)(React.memo(Detail));
