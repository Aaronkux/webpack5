import React from 'react';
import { Modal, Form, Input, Switch, Skeleton } from 'antd';
import { useRequest } from 'umi';
import { CloseCircleOutlined } from '@ant-design/icons';
import { querySale } from '@/services/sales';
import Avatar from '@/components/Avatar';
import styles from './Edit.less';

interface PropsType {
  onCancelHandler: () => void;
  saleId: number;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

export default function EditAndCreate({
  saleId,
  onCancelHandler,
}: PropsType) {
  const [form] = Form.useForm();
  const { data, error, loading } = useRequest(() => querySale(saleId));
  return (
    <Modal
      visible={true}
      closeIcon={<CloseCircleOutlined />}
      onOk={() => form.submit()}
      onCancel={onCancelHandler}
      okText={'Save'}
      cancelText="Cancel"
      maskClosable={true}
      className={styles.container}
      width={520}
      // confirmLoading={true}
    >
      {loading ? (
        <Skeleton loading={loading} active avatar />
      ) : (
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={(values) => console.log(values)}
        >
          <Form.Item label="Photo" name="photo" initialValue={data?.photo}>
            <Avatar />
          </Form.Item>
          <Form.Item label="Name" name="name" initialValue={data?.name}>
            <Input />
          </Form.Item>
          <Form.Item label="E-mail" name="email" initialValue={data?.email}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Active "
            name="status"
            valuePropName="checked"
            initialValue={data?.isActive}
          >
            <Switch checkedChildren="active" unCheckedChildren="inactive" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
