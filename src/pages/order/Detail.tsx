import React, { useEffect, useState } from 'react';
import {
  Skeleton,
  Form,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
  Button,
  Divider,
  Modal,
  Card,
} from 'antd';
import { connect, useDispatch, useRouteMatch } from 'umi';
import type { OrderModelState, Loading } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import BackButton from '@/components/BackButton';
import NormalText from '@/components/NormalText';
import type { OrderInfo } from '@/services/order';
import generatePDF from '@/utils/generatePDF';
import styles from './Detail.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 19 },
};

interface PropsType {
  orderDetail?: OrderInfo;
  loading: boolean;
}

const Detail = ({ orderDetail, loading }: PropsType) => {
  const [form] = Form.useForm();
  const match = useRouteMatch<{ id?: string }>();
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = match.params;
  useEffect(() => {
    if (id) {
      dispatch({
        type: 'orders/getOrderDetail',
        payload: { id },
      });
    }
  }, [id]);
  return (
    <Card>
      <BackButton />
      {!loading ? (
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={(values) => console.log(values)}
        >
          <div className={styles.titleAndButton}>
            <h1 className={styles.title}>Basic</h1>
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
                {editing ? (
                  <Button type="primary" onClick={() => setModalVisible(true)}>
                    Cancel
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                )}
              </Col>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Name"
                name="name"
                initialValue={orderDetail?.clientInfo.name}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Referral"
                name="referral"
                initialValue={orderDetail?.referral}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Salesman"
                name="salesman"
                initialValue={orderDetail?.salesman?.name}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="From Currency"
                name="fromCurrency"
                initialValue={orderDetail?.fromCurrency}
              >
                {editing ? (
                  <Select>
                    <Option value={'AUD'}>AUD</Option>
                    <Option value={'CNY'}>CNY</Option>
                    <Option value={'HKD'}>HKD</Option>
                    <Option value={'USD'}>USD</Option>
                    <Option value={'MYR'}>MYR</Option>
                    <Option value={'NZD'}>NZD</Option>
                    <Option value={'GBP'}>GBP</Option>
                    <Option value={'EUR'}>EUR</Option>
                    <Option value={'JPY'}>JPY</Option>
                  </Select>
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="From Amount"
                name="fromAmount"
                initialValue={orderDetail?.fromAmount?.toFixed(2)}
              >
                {editing ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                    precision={2}
                    step="1"
                    stringMode
                  />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="to Currency"
                name="toCurrency"
                initialValue={orderDetail?.toCurrency}
              >
                {editing ? (
                  <Select>
                    <Option value={'AUD'}>AUD</Option>
                    <Option value={'CNY'}>CNY</Option>
                    <Option value={'HKD'}>HKD</Option>
                    <Option value={'USD'}>USD</Option>
                    <Option value={'MYR'}>MYR</Option>
                    <Option value={'NZD'}>NZD</Option>
                    <Option value={'GBP'}>GBP</Option>
                    <Option value={'EUR'}>EUR</Option>
                    <Option value={'JPY'}>JPY</Option>
                  </Select>
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="to Amount"
                name="toAmount"
                initialValue={orderDetail?.toAmount?.toFixed(2)}
              >
                {editing ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                    precision={2}
                    step="1"
                    stringMode
                  />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Exchange Rate"
                name="exchangeRate"
                initialValue={orderDetail?.exchangeRate?.toFixed(2)}
              >
                {editing ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                    precision={2}
                    step="1"
                    stringMode
                  />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Base Rate"
                name="baseRate"
                initialValue={orderDetail?.baseRate?.toFixed(2)}
              >
                {editing ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                    precision={2}
                    step="1"
                    stringMode
                  />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Comment"
                name="comment"
                initialValue={orderDetail?.comment}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Department"
                name="department"
                initialValue={orderDetail?.department}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Special Consideration"
                name="specialConsideration"
                initialValue={orderDetail?.specialConsideration}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Dispensing Bank"
                name="dispensingBank"
                initialValue={orderDetail?.dispensingBank}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Receiver"
                name="receiver"
                initialValue={orderDetail?.receiver?.name}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <Row gutter={[16, 0]}>
                <Col>
                  <Button
                    type="primary"
                    htmlType="reset"
                    onClick={() => {
                      if (!orderDetail) return;
                      generatePDF(orderDetail, 'Tina', 'download');
                    }}
                  >
                    Confirm Letter
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={() =>
                      Modal.confirm({
                        title: 'Are you sure back to previous stage?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk() {
                          console.log('OK');
                        },
                        onCancel() {
                          console.log('Cancel');
                        },
                      })
                    }
                  >
                    Back To Previous Stage
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={[16, 0]}>
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
                  {editing ? (
                    <Button
                      type="primary"
                      onClick={() => setModalVisible(true)}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button type="primary" onClick={() => setEditing(true)}>
                      Edit
                    </Button>
                  )}
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      ) : (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      )}
      <Modal
        centered
        title="Unsaved confirm"
        visible={modalVisible}
        onOk={() => {
          form.resetFields();
          setEditing(false);
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      >
        <p>All unsaved changes will be discharged.</p>
      </Modal>
    </Card>
  );
};
export default connect(
  ({ orders, loading }: { orders: OrderModelState; loading: Loading }) => ({
    orderDetail: orders.detail,
    loading: loading.models.orders,
  }),
)(React.memo(Detail));
