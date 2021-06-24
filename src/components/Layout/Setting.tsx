import React from 'react';
import { useRequest } from 'umi';
import { Form, message, Input, Divider, Row, Col, Button } from 'antd';
import store from 'store';
import styles from './Setting.less';
import { updateUser, getUserDetail, UserInfo } from '@/services/users';
import { imageFileProcesser, createFormData } from '@/utils';
import AuthAndEditAvatar from '@/components/AuthAndEditAvatar';
import { useEffect } from 'react';

interface PropTypes {
  userData?: UserInfo;
  onCancelHandler: () => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export default function Setting({ userData, onCancelHandler }: PropTypes) {
  const [form] = Form.useForm();
  const user = store.get('user');

  const { loading: updating, run } = useRequest(updateUser, {
    manual: true,
    onSuccess: () => {
      form.resetFields();
      window.location.reload();
    },
  });

  const onFinishHandler = async (values: any) => {
    const { photo } = values;
    const tempData = {
      ...userData,
      ...values,
      ...{
        photo: imageFileProcesser(photo),
      },
    };
    run(user.id, createFormData(tempData));
  };
  return (
    <>
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={onFinishHandler}
        initialValues={user.photo}
      >
        <Form.Item
          label="Photo"
          name="photo"
          required
          rules={[{ required: true, message: 'Please upload your avatar!' }]}
          initialValue={userData?.photo}
        >
          <AuthAndEditAvatar />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          required
          rules={[{ required: true, message: 'Please enter your name!' }]}
          initialValue={userData?.name}
        >
          <Input />
        </Form.Item>
      </Form>
      <Divider />
      <Row gutter={[16, 0]} justify="end">
        <Col>
          <Button onClick={onCancelHandler}>Cancel</Button>
        </Col>
        <Col>
          <Button
            onClick={form.submit}
            loading={updating}
            type="primary"
            htmlType="submit"
          >
            Save
          </Button>
        </Col>
      </Row>
    </>
  );
}
