import React, { useState } from 'react';
import { request } from 'umi';
import { Modal, Form, Input, Switch, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import Avatar from '@/components/Avatar';
import styles from './Create.less';

interface PropsType {
  visible: boolean;
  onCancelHandler: () => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export default function Create({ visible, onCancelHandler }: PropsType) {
  const [form] = Form.useForm();
  const [adding, setAdding] = useState(false);

  const onFinishHandler = async (values: any) => {
    setAdding(true);
    const res = await request('/api/sales', { method: 'post', data: values });
    if (res.success) message.success('Adding Successfully!');
    setAdding(false);
    onCancelHandler();
  };
  return (
    <Modal
      centered
      width={1300}
      visible={visible}
      closeIcon={<CloseCircleOutlined />}
      onOk={() => {
        form.submit();
      }}
      onCancel={onCancelHandler}
      maskClosable={false}
      okText={'Add'}
      cancelText="Cancel"
      className={styles.container}
      confirmLoading={adding}
    >
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={onFinishHandler}
      >
        <Form.Item label="Photo" name="photo">
          <Avatar />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="E-mail"
          name="email"
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
        >
          <Switch checkedChildren="active" unCheckedChildren="inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
