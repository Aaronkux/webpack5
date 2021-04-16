import React from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import styles from './EditAndCreate.less';

interface PropsType {
  children?: React.ReactNode;
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export default function EditAndCreate({ children, visible, setVisible }: PropsType) {
  const [form] = Form.useForm();
  
  return (
    <Modal
      visible={visible}
      closeIcon={<CloseCircleOutlined />}
      onOk={() => form.submit()}
      onCancel={() => setVisible(false)}
      okText="Save"
      cancelText="Cancel"
      maskClosable={false}
      className={styles.container}
      width={1000}
      // confirmLoading={true}
    >
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={(values) => console.log(values)}
      >
        <Form.Item label="Name" name="name" initialValue="aaron">
          <Input />
        </Form.Item>
        <Form.Item label="E-mail" name="email" initialValue="123">
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
