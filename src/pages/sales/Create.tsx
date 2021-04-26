import React from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import Avatar from '@/components/Avatar';
import styles from './Create.less';

interface PropsType {
  visible: boolean;
  onCancelHandler: () => void;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export default function Create({ visible, onCancelHandler }: PropsType) {
  const [form] = Form.useForm();
  return (
    <Modal
      centered
      visible={visible}
      closeIcon={<CloseCircleOutlined />}
      onOk={() => form.submit()}
      onCancel={onCancelHandler}
      okText={'Add'}
      cancelText="Cancel"
      maskClosable={true}
      className={styles.container}
      width={520}
      // confirmLoading={true}
    >
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={(values) => console.log(values)}
      >
        <Form.Item label="Photo" name="photo">
          <Avatar />
        </Form.Item>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="E-mail" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Active " name="status" valuePropName="checked">
          <Switch checkedChildren="active" unCheckedChildren="inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
