import React from 'react';
import { Form, Input, Switch, Divider, Row, Col, Button } from 'antd';
import type { SalesInfo } from '@/services/sales';
import AuthAndEditAvatar from '@/components/AuthAndEditAvatar';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

interface PropsType {
  data: SalesInfo | undefined;
  onFinishHandler?: ((values: Partial<SalesInfo>) => void) | undefined;
  saving: boolean;
  onCancelHandler: () => void;
}

export default function EditForm({
  data,
  onFinishHandler,
  onCancelHandler,
  saving,
}: PropsType) {
  const [form] = Form.useForm();
  return (
    <>
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={onFinishHandler}
      >
        <Form.Item
          label="Photo"
          name="photo"
          initialValue={data?.photo}
          required
          rules={[{ required: true, message: 'Please upload your avatar!' }]}
        >
          <AuthAndEditAvatar value={data?.photo} />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          initialValue={data?.name}
          required
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="E-mail"
          name="email"
          initialValue={data?.email}
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
          initialValue={data?.isActive}
          required
        >
          <Switch checkedChildren="active" unCheckedChildren="inactive" />
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
            loading={saving}
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
