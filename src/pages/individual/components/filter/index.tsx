import React from 'react';
import { Form, Input, Col, Row, Button } from 'antd';

import styles from './index.less';

const layout = {
  // labelCol: { span: 4 },
  // wrapperCol: { span: 16 },
};

export default function Filter() {
  const [form] = Form.useForm();
  return (
    <Form
      {...layout}
      className={styles.form}
      form={form}
      onFinish={(values) => console.log(values)}
    >
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} lg={12} xl={6}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12} xl={6}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12} xl={6}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12} xl={6}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 0]} justify="end">
        <Col>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          <Button
            type="primary"
            htmlType="reset"
            onClick={() => form.resetFields()}
          >
            Reset
          </Button>
        </Col>
        <Col>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
