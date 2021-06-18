import React, { useEffect, useState } from 'react';
import {
  Skeleton,
  Form,
  Input,
  Row,
  Col,
  Select,
  Radio,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Divider,
  Modal,
  message,
} from 'antd';
import { useRouteMatch, useRequest } from 'umi';
import moment from 'moment';
import type { Moment } from 'moment';
import NormalText from '@/components/NormalText';
import UploadPicture from '@/components/UploadPicture';
import type { IndividualClientInfo } from '@/services/clients';
import {
  updateIndividualClientsDetail,
  getIndividualClientsDetail,
} from '@/services/clients';
import { queryAllSalesByName } from '@/services/sales';
import { createFormData, imageFileProcesser } from '@/utils';
import styles from './index.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 19 },
};

const purposeOptions = [
  'property',
  'pepayment',
  'immigration',
  'investment',
  'living',
  'deposit',
  'gift',
];

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormClientInfo = Merge<
  Omit<Partial<IndividualClientInfo>, 'salesman' | 'gender'>,
  {
    DOB: Moment;
    id1ExpireDate: Moment | '';
    id2ExpireDate: Moment | '';
    salesman: string;
    purpose: string;
    other: string;
  }
>;

const Personal = () => {
  const [form] = Form.useForm();
  const match = useRouteMatch<{ id?: string }>();
  const { id } = match.params;

  const [showOther, setShowOther] = useState(false);
  const [editing, setEditing] = useState(false);
  const [salesmanChanged, setSalesmanChanged] = useState(false);
  // should resetFields after fetch, manual setloading avoiding re-request & re-render of form and img.
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data: salesData,
    loading: salesLoading,
    mutate,
    run: querySales,
  } = useRequest(queryAllSalesByName, {
    manual: true,
    formatResult: (res) => {
      return res.data?.data ?? [];
    },
  });

  const { data, run } = useRequest(getIndividualClientsDetail, {
    manual: true,
    onSuccess: () => {
      form.resetFields();
      setLoading(false);
    },
  });

  const queryIndividualClientsDetail = () => {
    if (id) {
      run(id);
    }
  };

  const { loading: updating, run: saveChange } = useRequest(
    updateIndividualClientsDetail,
    {
      manual: true,
      onSuccess: () => {
        setEditing(false);
        message.success('Update Successfully!');
        setLoading(true);
        queryIndividualClientsDetail();
      },
    },
  );

  const onSearchHandler = (val: string) => {
    if (val === '' && salesData?.length) {
      mutate([]);
    } else {
      querySales(val);
    }
  };

  useEffect(() => {
    setLoading(true);
    queryIndividualClientsDetail();
  }, [id]);

  useEffect(() => {
    if (data?.purpose && !purposeOptions.includes(data.purpose)) {
      setShowOther(true);
    }
  }, [data]);
  const onFinishHandler = async (values: FormClientInfo) => {
    if (!id) {
      message.error(`Can't Find Id Of The Receiver`);
      return;
    }
    const {
      DOB,
      id1front,
      id1back,
      id2front,
      id2back,
      faceImage,
      faceTest,
      signature,
      id1ExpireDate,
      id2ExpireDate,
      purpose,
      receiver,
      salesman,
      other,
      ...rest
    } = values;
    const tempData = {
      ...rest,
      ...{
        salesman: salesmanChanged ? salesman : undefined,
        DOB: DOB?.format('YYYY-MM-DD'),
        id1ExpireDate: id1ExpireDate
          ? id1ExpireDate?.format('YYYY-MM-DD')
          : undefined,
        id2ExpireDate: id2ExpireDate
          ? id2ExpireDate?.format('YYYY-MM-DD')
          : undefined,
        id1front: imageFileProcesser(id1front),
        id1back: imageFileProcesser(id1back),
        id2front: imageFileProcesser(id2front),
        id2back: imageFileProcesser(id2back),
        faceImage: imageFileProcesser(faceImage),
        faceTest: imageFileProcesser(faceTest),
        signature: imageFileProcesser(signature),
        purpose: purpose === 'other' ? other : purpose,
      },
    };
    saveChange(id, createFormData(tempData));
  };

  return (
    <>
      {!loading ? (
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={onFinishHandler}
        >
          <div className={styles.titleAndButton}>
            <h1 className={styles.title}>Basic</h1>
            <Row gutter={[16, 0]} justify="end">
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
                label="Name"
                name="name"
                initialValue={data?.name}
                required
                rules={[{ required: true, message: 'Please Enter Your Name!' }]}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Gender"
                name="gender"
                initialValue={data?.gender ? 0 : 1}
                required
              >
                {editing ? (
                  <Radio.Group>
                    <Radio.Button value={0}>Male</Radio.Button>
                    <Radio.Button value={1}>Female</Radio.Button>
                  </Radio.Group>
                ) : (
                  <NormalText
                    transform={(value) => (value === 0 ? 'Male' : 'Female')}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="E-mail"
                name="email"
                initialValue={data?.email}
                required
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Please Enter Correct Email!',
                  },
                ]}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="DOB"
                name="DOB"
                initialValue={moment(data?.DOB)}
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Salesman"
                name="salesman"
                initialValue={data?.salesman?.name}
              >
                {editing ? (
                  <Select
                    disabled={!editing}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    loading={salesLoading}
                    onSelect={() => setSalesmanChanged(true)}
                    onSearch={onSearchHandler}
                  >
                    {salesData?.map((sale) => (
                      <Option key={sale.id} value={sale.id}>
                        {sale.name}
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
                label="Occupation"
                name="occupation"
                initialValue={data?.occupation}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="EmployerName"
                name="employerName"
                initialValue={data?.employerName}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="AnnualIncome"
                name="annualIncome"
                initialValue={data?.annualIncome}
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
                label="SourceOfIncome"
                name="sourceOfIncome"
                initialValue={data?.sourceOfIncome}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Purpose"
                name="purpose"
                initialValue={
                  data?.purpose
                    ? purposeOptions.includes(data?.purpose)
                      ? data?.purpose
                      : 'Other'
                    : undefined
                }
              >
                {editing ? (
                  <Select
                    onChange={(value) => {
                      if (value === 'other') {
                        setShowOther(true);
                      } else if (showOther === true) {
                        setShowOther(false);
                      }
                    }}
                  >
                    <Option value="property">Property</Option>
                    <Option value="pepayment">Repayment</Option>
                    <Option value="immigration">Immigration</Option>
                    <Option value="investment">Investment</Option>
                    <Option value="living">Living</Option>
                    <Option value="deposit">Deposit</Option>
                    <Option value="gift">Gift</Option>
                    <Option value="other">Other</Option>
                  </Select>
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Unsubscribe"
                name="unsubscribe"
                valuePropName="checked"
                initialValue={data?.unsubscribe}
              >
                <Switch disabled={!editing} />
              </Form.Item>
            </Col>
            {showOther && (
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Other"
                  name="other"
                  initialValue={data?.purpose}
                >
                  {editing ? <Input /> : <NormalText />}
                </Form.Item>
              </Col>
            )}
          </Row>

          <h1 className={styles.title}>Address</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Address"
                name="address"
                initialValue={data?.address}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Suburb"
                name="suburb"
                initialValue={data?.suburb}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="State" name="state" initialValue={data?.state}>
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Country"
                name="country"
                initialValue={data?.country}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Postcode"
                name="postcode"
                initialValue={data?.postcode}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
          </Row>
          <h1 className={styles.title}>Attachment File</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID1 Front"
                name="id1front"
                initialValue={data?.id1front}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID1 Back"
                name="id1back"
                initialValue={data?.id1back}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID2 Front"
                name="id2front"
                initialValue={data?.id2front}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID2 Back"
                name="id2back"
                initialValue={data?.id2back}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Face"
                name="faceImage"
                initialValue={data?.faceImage}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="FaceTest"
                name="faceTest"
                initialValue={data?.faceTest}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID1 Expire Date"
                name="id1ExpireDate"
                initialValue={
                  data?.id1ExpireDate ? moment(data?.id1ExpireDate) : undefined
                }
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID2 Expire Date"
                name="id2ExpireDate"
                initialValue={
                  data?.id2ExpireDate ? moment(data?.id2ExpireDate) : undefined
                }
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Signature"
                name="signature"
                initialValue={data?.signature}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]} justify="end">
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
    </>
  );
};
export default React.memo(Personal);
