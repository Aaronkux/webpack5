import React, { useState } from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { useRequest } from 'umi';
import { CloseCircleOutlined } from '@ant-design/icons';
import { isBlob, createFormData } from '@/utils';
import { addSale } from '@/services/sales';
import AuthAndEditAvatar from '@/components/AuthAndEditAvatar';
import styles from './Create.less';

interface PropsType {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSales: () => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const imageFileProcesser = (file: any) => {
  if (isBlob(file)) {
    return file;
  } else {
    return undefined;
  }
};

export default function Create({ visible, setVisible, fetchSales }: PropsType) {
  const [form] = Form.useForm();

  const { loading: adding, run } = useRequest(addSale, {
    manual: true,
    onSuccess: () => {
      message.success('Add Successfully');
      fetchSales();
      onCancelHandler();
    },
  });

  const onFinishHandler = async (values: any) => {
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
    setVisible(false);
  };
  return (
    <Modal
      centered
      visible={visible}
      closeIcon={<CloseCircleOutlined />}
      onOk={() => form.submit()}
      onCancel={onCancelHandler}
      maskClosable={false}
      okText={'Add'}
      cancelText="Cancel"
      className={styles.container}
      width={520}
      confirmLoading={adding}
    >
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={onFinishHandler}
      >
        <Form.Item
          label="Photo"
          name="photo"
          required
          rules={[{ required: true, message: 'Please upload your avatar!' }]}
        >
          <AuthAndEditAvatar />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          required
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="E-mail"
          name="email"
          required
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please enter a valid email!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Active "
          name="status"
          valuePropName="checked"
          initialValue={true}
          required
        >
          <Switch checkedChildren="active" unCheckedChildren="inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
