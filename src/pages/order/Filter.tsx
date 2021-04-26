import React from 'react';
import { Form, Input, Col, Row, Button } from 'antd';

interface PropsType {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Filter({ setVisible }: PropsType) {
  const [form] = Form.useForm();
  return (
    <Form form={form} onFinish={(values) => console.log(values)}>
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
          <Button type="primary" onClick={() => setVisible(true)}>
            New
          </Button>
        </Col>
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
