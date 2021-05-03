import React from 'react';
import { Form, Input, Col, Row, Button, Select } from 'antd';

interface PropsType {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const { Option } = Select;
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
          <Form.Item label="Stage" name="stage">
            <Select>
              <Option value={0}>Compliance</Option>
              <Option value={1}>Fund Notified</Option>
              <Option value={2}>Fund Received</Option>
              <Option value={3}>Confirmation Sent</Option>
              <Option value={4}>Client Confirmed</Option>
              <Option value={5}>Fund Paid</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[8, 0]} justify="end">
        <Col>
          <Button type="primary" onClick={() => setVisible(true)}>
            New
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
