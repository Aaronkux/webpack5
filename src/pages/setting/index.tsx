import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  message,
  Button,
  Divider,
  InputNumber,
  Skeleton,
} from 'antd';
import { useRequest } from 'umi';
import { getSetting, updateSetting } from '@/services/setting';
import styles from './index.less';
import moment from 'moment';
import { createFormData } from '@/utils';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 19 },
};

const Setting = () => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  const { data: rateDetail, loading, run } = useRequest(getSetting, {
    manual: true,
  });

  const { loading: updating, run: update } = useRequest(updateSetting, {
    manual: true,
    onSuccess: () => {
      message.success('Update Successfully!');
      setEditing(false);
      run();
    },
  });

  const finishHandler = async (values: any) => {
    update(createFormData(values));
  };

  useEffect(() => {
    run();
  }, []);
  return (
    <Card className={styles.container}>
      <Row align="middle" justify="space-between">
        <Col>
          <h2 className={styles.title}>Basic Rate</h2>
        </Col>
        <Col>
          <span className={styles.update}>
            Last Updated at{' '}
            {moment(rateDetail?.lastModified)
              .zone(6)
              .format('DD-MMM-YYYY h:mm:ss')}
          </span>
        </Col>
      </Row>
      <Card className={styles.subContainer}>
        <Skeleton loading={loading} active avatar paragraph={{ rows: 10 }}>
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
                    <Button loading={updating} type="primary" htmlType="submit">
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
              <Col offset={2} xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label="CNY/AUD"
                  name="CNYAUDBaseRate"
                  initialValue={rateDetail?.CNYAUDBaseRate}
                >
                  <InputNumber
                    disabled={!editing}
                    precision={4}
                    style={{ width: '50%' }}
                  />
                </Form.Item>
              </Col>
              <Col offset={2} xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label="AUD/CNY"
                  name="AUDCNYBaseRate"
                  initialValue={rateDetail?.AUDCNYBaseRate}
                >
                  <InputNumber
                    disabled={!editing}
                    precision={4}
                    style={{ width: '50%' }}
                  />
                </Form.Item>
              </Col>
              <Col offset={2} xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label="USD/CNY"
                  name="USDCNYBaseRate"
                  initialValue={rateDetail?.USDCNYBaseRate}
                >
                  <InputNumber
                    disabled={!editing}
                    precision={4}
                    style={{ width: '50%' }}
                  />
                </Form.Item>
              </Col>
              <Col offset={2} xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label="CNY/USD"
                  name="CNYUSDBaseRate"
                  initialValue={rateDetail?.CNYUSDBaseRate}
                >
                  <InputNumber
                    disabled={!editing}
                    precision={4}
                    style={{ width: '50%' }}
                  />
                </Form.Item>
              </Col>
              <Col offset={2} xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label="AUD/USD"
                  name="AUDUSDBaseRate"
                  initialValue={rateDetail?.AUDUSDBaseRate}
                >
                  <InputNumber
                    disabled={!editing}
                    precision={4}
                    style={{ width: '50%' }}
                  />
                </Form.Item>
              </Col>
              <Col offset={2} xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  label="USD/AUD"
                  name="USDAUDBaseRate"
                  initialValue={rateDetail?.USDAUDBaseRate}
                >
                  <InputNumber
                    disabled={!editing}
                    precision={4}
                    style={{ width: '50%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Skeleton>
      </Card>
    </Card>
  );
};

export default Setting;
