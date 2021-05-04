import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  message,
  Button,
  Divider,
  InputNumber,
} from 'antd';
import { useDispatch, request } from 'umi';
import RateInput from './RateInput';
import styles from './index.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

const Setting = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const finishHandler = async (values: any) => {
    console.log(values);
    setSaving(true);
    const res = await request('/api/rate', {
      method: 'post',
      data: values,
    });
    if (res.success) message.success('Save Successfully');
    setSaving(false);
    dispatch({
      type: 'setting/getBaseRate',
    });
    setEditing(false);
  };
  return (
    <Card className={styles.container}>
      <Row align="middle" justify="space-between">
        <Col>
          <h2 className={styles.title}>Basic Rate</h2>
        </Col>
        <Col>
          <span className={styles.update}>
            Last Updated at 2021/4/3 8:00:00 am
          </span>
        </Col>
      </Row>
      <Card className={styles.subContainer}>
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={finishHandler}
        >
          <Row style={{ height: '32px' }} gutter={[16, 0]} justify="end">
            {editing && (
              <Col>
                <Form.Item>
                  <Button loading={saving} type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Col>
            )}

            <Col>
              {editing ? (
                <Button type="primary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              ) : (
                <Button type="primary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="AUS/RMB"
                name="aus2rmb"
                initialValue={{ in: '1.23232', out: '2.32132' }}
              >
                <RateInput editing={editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="USD/RMB"
                name="usd2rmb"
                initialValue={{ in: '1.23232', out: '2.32132' }}
              >
                <RateInput editing={editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="AUS/USD"
                name="aus2usd"
                initialValue={{ in: '1.23232', out: '2.32132' }}
              >
                <RateInput editing={editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="AUS/CAD"
                name="aus2cad"
                initialValue={{ in: '1.23232', out: '2.32132' }}
              >
                <RateInput editing={editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="AUS/NZD"
                name="aus2nzd"
                initialValue={{ in: '1.23232', out: '2.32132' }}
              >
                <RateInput editing={editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="AUS/JPY"
                name="aus2jpy"
                initialValue={{ in: '1.23232', out: '2.32132' }}
              >
                <RateInput editing={editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="AUS/EUR"
                name="aus2eur"
                initialValue={{ in: '1.23232', out: '2.32132' }}
              >
                <RateInput editing={editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="AUS/GBP"
                name="aus2gbp"
                initialValue={{ in: '1.23232', out: '2.32132' }}
              >
                <RateInput editing={editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="USD/HKD"
                name="usd2hkd"
                initialValue={{ in: '1.23232', out: '2.32132' }}
              >
                <RateInput editing={editing} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Card>
  );
};

export default Setting;
