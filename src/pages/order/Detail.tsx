import React, { useEffect, useState, useMemo } from 'react';
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
  message,
} from 'antd';
import { useRouteMatch, request, useRequest } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import BackButton from '@/components/BackButton';
import NormalText from '@/components/NormalText';
import { queryAllSalesByName } from '@/services/sales';
import { getOrderDetail, updateOrder } from '@/services/order';
import type { BeneficiaryInfo } from '@/services/clients';
import { createFormData } from '@/utils';
import { getClients } from '@/services/clients';
import generatePDF from '@/utils/generatePDF';
import styles from './Detail.less';

const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 19 },
};
const currencies = [
  'AUD',
  'CNY',
  'HKD',
  'USD',
  'MYR',
  'NZD',
  'GBP',
  'EUR',
  'JPY',
];

const Detail = () => {
  const [form] = Form.useForm();
  const match = useRouteMatch<{ id?: string }>();
  const [editing, setEditing] = useState(false);
  const [downloadOrSend, setDownloadOrSend] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = match.params;
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedReceivers, setSelectedReceivers] = useState<string[]>([]);
  const [clientType, setClientType] = useState(0);
  const [clients, setClients] = useState<{
    [prop: string]: {
      id: string;
      name: string;
      receiver: BeneficiaryInfo[];
      amount?: number;
    };
  }>({});

  const [receivers, setReceivers] = useState<{
    [prop: string]: {
      id: string;
      name?: string;
      amount?: number;
    };
  }>({});

  const {
    data: clientData,
    loading: clientLoading,
    mutate,
    run: queryClients,
  } = useRequest(getClients, {
    manual: true,
    formatResult: (res) => {
      return res.data?.data ?? [];
    },
  });

  const availableReceivers = useMemo(() => {
    const filterSet = new Set<string>();
    const res = Object.values(clients)
      .map((item) => item.receiver)
      .flat()
      .filter((item) => {
        if (filterSet.has(item.id)) return false;
        filterSet.add(item.id);
        return true;
      });
    const availableReceiverIds = res.map((val) => val.id);
    setSelectedReceivers(
      selectedReceivers.filter((id) => availableReceiverIds.includes(id)),
    );
    let newReceivers: {
      [prop: string]: {
        id: string;
        name?: string;
        amount?: number;
      };
    } = {};
    for (let item of Object.values(receivers)) {
      if (availableReceiverIds.includes(item.id)) {
        newReceivers[item.id] = item;
      }
    }
    setReceivers(newReceivers);
    return res;
  }, [clients]);

  const { data: orderDetail, run, loading } = useRequest(getOrderDetail, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        const clients = res.orderCompanyClients.length
          ? res.orderCompanyClients
          : res.orderIndividualClients;
        setClientType(res.orderCompanyClients.length ? 1 : 0);
        let initialClients: {
          [prop: string]: {
            id: string;
            name: string;
            receiver: BeneficiaryInfo[];
            amount?: number;
          };
        } = {};
        let selectClientsArr: string[] = [];
        let clientsMutateData: {
          id: string;
          name: string;
          receiver: BeneficiaryInfo[];
        }[] = [];
        clients.forEach((item) => {
          const amount = item.amount;
          const { id, name, receiver } = item.client;
          initialClients[id] = { id, name, receiver, amount };
          selectClientsArr.push(id);
          clientsMutateData.push({ id, name, receiver });
        });
        setSelectedClients(selectClientsArr);
        setClients(initialClients);

        let initialReceivers: {
          [prop: string]: {
            id: string;
            name?: string;
            amount?: number;
          };
        } = {};
        let selectReceiversArr: string[] = [];
        res.orderReceivers.forEach((item) => {
          const { receiver, name, amount } = item;
          initialReceivers[receiver.id] = { id: receiver.id, name, amount };
          selectReceiversArr.push(receiver.id);
        });
        console.log(selectReceiversArr, initialReceivers);
        setSelectedReceivers(selectReceiversArr);
        setReceivers(initialReceivers);
      }
    },
  });

  const queryOrderDetail = () => {
    if (id) {
      run(id);
    }
  };

  const { run: updateOrderDetail, loading: saving } = useRequest(updateOrder, {
    manual: true,
    onSuccess: () => {
      message.success('Update Successfully!');
      queryOrderDetail();
      setEditing(false);
    },
  });
  const onFetchClientsHandler = (name: string) => {
    queryClients(clientType ? 'companyclients' : 'individualclients', name);
  };

  const onSelectHandler = (id: string) => {
    if (!clients[id]) {
      setClients({
        ...clients,
        [id]: clientData?.find((item) => item.id === id)!,
      });
    }
  };

  const onDeselectHandler = (id: string) => {
    const { [id]: omitItem, ...rest } = clients;
    setClients(rest);
  };

  const onInputChangeHandler = (amount: number, id: string) => {
    setClients({
      ...clients,
      [id]: {
        id,
        name: clients[id].name,
        amount,
        receiver: clients[id].receiver,
      },
    });
  };

  const onReceiverSelectHandler = (id: string) => {
    if (!receivers[id]) {
      setReceivers({
        ...receivers,
        [id]: availableReceivers?.find((item) => item.id === id)!,
      });
    }
  };

  const onReceiverDeselectHandler = (id: string) => {
    const { [id]: omitItem, ...rest } = receivers;
    setReceivers(rest);
  };

  const onReceiverInputChangeHandler = (amount: number, id: string) => {
    setReceivers({
      ...receivers,
      [id]: {
        id,
        name: receivers[id].name,
        amount,
      },
    });
  };

  const onClientTypeChangeHandler = (val: number) => {
    //clients
    setClientType(val);
    setClients({});
    setSelectedClients([]);
    mutate([]);

    // receivers
    setReceivers({});
    setSelectedReceivers([]);
  };

  const onClientChangeHandler = (val: string[]) => {
    if (val.length === 0) {
      mutate([]);
    }
    setSelectedClients(val);
  };

  const onReceiverChangeHandler = (val: string[]) => {
    setSelectedReceivers(val);
  };

  const finishHandler = async (values: any) => {
    if (!id) {
      message.warning(`Can't find corresponding order id`);
      return;
    }
    let clientInfo: any = {};
    const clientData = JSON.stringify(
      Object.values(clients).map((item) => {
        const { id, amount } = item;
        return { id, amount };
      }),
    );
    const receiverData = JSON.stringify(
      Object.values(receivers).map((item) => {
        const { id, amount } = item;
        return { id, amount };
      }),
    );
    if (clientType) {
      clientInfo['companyClient'] = clientData;
    } else {
      clientInfo['individualClient'] = clientData;
    }

    updateOrderDetail(
      id,
      createFormData({
        ...values,
        ...clientInfo,
        receiver: receiverData,
      }),
    );
  };

  useEffect(() => {
    form.resetFields();
  }, [editing]);

  useEffect(() => {
    queryOrderDetail();
  }, [id]);
  return (
    <Card>
      <BackButton />
      {!loading ? (
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={finishHandler}
        >
          <div className={styles.titleAndButton}>
            <h1 className={styles.title}>Basic</h1>
            <Row gutter={[16, 0]} justify="end">
              {editing ? (
                <Col>
                  <Form.Item>
                    <Button loading={saving} type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Col>
              ) : (
                ''
              )}

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
            </Row>
          </div>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ClientType"
                rules={[
                  { required: true, message: 'Please select client type!' },
                ]}
                required
              >
                <Select
                  disabled={!editing}
                  value={clientType}
                  onChange={onClientTypeChangeHandler}
                >
                  <Option value={0}>Individual</Option>
                  <Option value={1}>Company</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Client"
                required
                rules={[{ required: true, message: 'Please select client!' }]}
              >
                <Select
                  disabled={!editing}
                  value={selectedClients}
                  onChange={onClientChangeHandler}
                  onSearch={onFetchClientsHandler}
                  loading={clientLoading}
                  showSearch
                  mode="multiple"
                  optionFilterProp="children"
                  onSelect={onSelectHandler}
                  onDeselect={onDeselectHandler}
                >
                  {clientData
                    ? clientData?.map((v) => (
                        <Option key={v.id} value={v.id}>
                          {v.name}
                        </Option>
                      ))
                    : Object.values(clients).map((v) => (
                        <Option key={v.id} value={v.id}>
                          {v.name}
                        </Option>
                      ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
            {Object.values(clients).map((item) => (
              <Col
                key={item.id}
                xs={16}
                sm={16}
                md={16}
                lg={12}
                xl={12}
                offset={6}
                className={styles.test}
              >
                <div className={styles.testContainer}>
                  <div className={styles.name}>{item.name}: </div>
                  {editing ? (
                    <InputNumber
                      className={styles.input}
                      value={item.amount}
                      onChange={(value) => onInputChangeHandler(value, item.id)}
                    />
                  ) : (
                    <NormalText value={item.amount} />
                  )}
                </div>
              </Col>
            ))}
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Receiver"
                rules={[{ required: true, message: 'Please select receiver!' }]}
                required
              >
                <Select
                  disabled={!editing}
                  value={selectedReceivers}
                  onChange={onReceiverChangeHandler}
                  mode="multiple"
                  optionFilterProp="children"
                  onSelect={onReceiverSelectHandler}
                  onDeselect={onReceiverDeselectHandler}
                >
                  {availableReceivers.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
            {Object.values(receivers).map((item) => (
              <Col
                key={item.id}
                xs={16}
                sm={16}
                md={16}
                lg={12}
                xl={12}
                offset={6}
                className={styles.test}
              >
                <div className={styles.testContainer}>
                  <div className={styles.name}>{item.name}: </div>
                  {editing ? (
                    <InputNumber
                      className={styles.input}
                      value={item.amount}
                      onChange={(value) =>
                        onReceiverInputChangeHandler(value, item.id)
                      }
                    />
                  ) : (
                    <NormalText value={item.amount} />
                  )}
                </div>
              </Col>
            ))}
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="From Currency"
                name="fromCurrency"
                initialValue={orderDetail?.fromCurrency}
                rules={[
                  { required: true, message: 'Please choose currency!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('toCurrency') !== value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          `From currency can't be same as to currency!`,
                        ),
                      );
                    },
                  }),
                ]}
                required
              >
                {editing ? (
                  <Select allowClear>
                    {currencies.map((cur) => (
                      <Option key={cur} value={cur}>
                        {cur}
                      </Option>
                    ))}
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
                initialValue={orderDetail?.fromAmount}
                rules={[{ required: true, message: 'Please input amount!' }]}
                required
              >
                {editing ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={2}
                    step="1"
                  />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="To Currency"
                name="toCurrency"
                initialValue={orderDetail?.toCurrency}
                rules={[
                  { required: true, message: 'Please choose currency!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('fromCurrency') !== value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          `To currency can't be same as from currency!`,
                        ),
                      );
                    },
                  }),
                ]}
                required
              >
                {editing ? (
                  <Select allowClear>
                    {currencies.map((cur) => (
                      <Option key={cur} value={cur}>
                        {cur}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="To Amount"
                name="toAmount"
                initialValue={orderDetail?.toAmount}
                rules={[{ required: true, message: 'Please input amount!' }]}
                required
              >
                {editing ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={2}
                    step="1"
                  />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Fee Currency"
                name="feeCurrency"
                initialValue={orderDetail?.feeCurrency}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        getFieldValue('fromCurrency') === value ||
                        getFieldValue('toCurrency') === value
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          `Fee currency must be to currency or from currency!`,
                        ),
                      );
                    },
                  }),
                ]}
              >
                {editing ? (
                  <Select allowClear>
                    {currencies.map((cur) => (
                      <Option key={cur} value={cur}>
                        {cur}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Fee Amount"
                name="feeAmount"
                initialValue={orderDetail?.feeAmount}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!parseFloat(value) || getFieldValue('feeCurrency')) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(`Fee currency must be selected!`),
                      );
                    },
                  }),
                ]}
              >
                {editing ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={2}
                    step="1"
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
                initialValue={orderDetail?.exchangeRate}
                rules={[
                  { required: true, message: 'Please input exchangeRate!' },
                ]}
                required
              >
                {editing ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={4}
                    step="1"
                  />
                ) : (
                  <NormalText />
                )}
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
                label="Department"
                name="department"
                initialValue={orderDetail?.department}
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
                label="Comments"
                name="comments"
                initialValue={orderDetail?.comment}
              >
                <TextArea disabled={!editing} rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Special Consideration"
                name="specialConsideration"
                initialValue={orderDetail?.specialConsideration}
              >
                <TextArea disabled={!editing} rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              {!editing && (
                <Row gutter={[16, 0]}>
                  <Col>
                    <Button
                      type="primary"
                      disabled={!orderDetail?.confirmationSent}
                      loading={downloadOrSend}
                      onClick={async () => {
                        if (!orderDetail) return;
                        setDownloadOrSend(true);
                        await generatePDF(orderDetail, 'Tina', 'download');
                        setDownloadOrSend(false);
                      }}
                    >
                      Download Confirm Letter
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      disabled={!orderDetail?.confirmationSent}
                      loading={downloadOrSend}
                      onClick={async () => {
                        if (!orderDetail) return;
                        setDownloadOrSend(true);
                        console.log(
                          await generatePDF(orderDetail, 'Tina', 'blob'),
                        );
                        const res = await request('/api/order/letter', {
                          method: 'post',
                          data: 'test',
                        });
                        if (res.success)
                          message.success(
                            'Successfully send to client and salesman!',
                          );
                        setDownloadOrSend(false);
                      }}
                    >
                      Send Confirm Letter
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      danger
                      onClick={() =>
                        Modal.confirm({
                          title: 'Are you sure back to previous stage?',
                          icon: <ExclamationCircleOutlined />,
                          okText: 'Yes',
                          okType: 'danger',
                          cancelText: 'No',
                          centered: true,
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
              )}
            </Col>
            <Col>
              <Row gutter={[16, 0]}>
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
export default React.memo(Detail);
