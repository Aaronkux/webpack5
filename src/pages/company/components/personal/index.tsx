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
import type { CompanyClientInfo } from '@/services/clients';
import {
  updateCompanyClientsDetail,
  getCompanyClientsDetail,
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
  'provider',
  'salary',
  'property',
  'Loan_Mortgage_Rent_Billing',
  'investment',
];

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormCompanyClientInfo = Merge<
  Partial<CompanyClientInfo>,
  {
    accountHolderDOB: Moment;
    person1ExpireDate: Moment;
    person2ExpireDate: Moment;
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

  const { data, run } = useRequest(getCompanyClientsDetail, {
    manual: true,
    onSuccess: (res) => {
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
    updateCompanyClientsDetail,
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
  const onFinishHandler = async (values: FormCompanyClientInfo) => {
    if (!id) {
      message.error(`Can't Find Id Of The Receiver`);
      return;
    }
    const {
      accountHolderDOB,
      signature,
      person1ExpireDate,
      legalPerson1front,
      legalPerson1back,
      legalPerson2front,
      legalPerson2back,
      companyExtract,
      person2ExpireDate,
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
        accountHolderDOB: accountHolderDOB?.format('YYYY-MM-DD'),
        id1ExpireDate: person1ExpireDate?.format('YYYY-MM-DD'),
        id2ExpireDate: person2ExpireDate?.format('YYYY-MM-DD'),
        legalPerson1front: imageFileProcesser(legalPerson1front),
        legalPerson1back: imageFileProcesser(legalPerson1back),
        legalPerson2front: imageFileProcesser(legalPerson2front),
        legalPerson2back: imageFileProcesser(legalPerson2back),
        companyExtract: imageFileProcesser(companyExtract),
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
            <h1 className={styles.title}>Company Details</h1>
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
                label="Entity Name"
                name="name"
                required
                initialValue={data?.name}
                rules={[
                  { required: true, message: 'Please Enter Your Entity Name!' },
                ]}
              >
                {editing ? <Input placeholder="Entity Name" /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Entity Type"
                name="companyType"
                initialValue={data?.companyType}
                required
                rules={[
                  { required: true, message: 'Please Enter Your Entity Type!' },
                ]}
              >
                {editing ? <Input placeholder="Entity Type" /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Registered Address"
                name="registeredBusinessAddress"
                initialValue={data?.registeredBusinessAddress}
                required
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Your Registered Address!',
                  },
                ]}
              >
                {editing ? (
                  <Input placeholder="Registered Business Address" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Principle Address"
                name="principleBusinessAddress"
                initialValue={data?.principleBusinessAddress}
                required
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Your Principle Address!',
                  },
                ]}
              >
                {editing ? (
                  <Input placeholder="Principle Business Address" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Contact Number"
                name="companyContactNumber"
                initialValue={data?.companyContactNumber}
                required
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Your Contact Number!',
                  },
                ]}
              >
                {editing ? (
                  <Input placeholder="Company Contact Number" />
                ) : (
                  <NormalText />
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
                {editing ? (
                  <Input placeholder="Company Email" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ABN_ACN_ARBN"
                name="ABN_ACN_ARBN"
                initialValue={data?.ABN_ACN_ARBN}
                required
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Your ABN_ACN_ARBN!',
                  },
                ]}
              >
                {editing ? (
                  <Input placeholder="ABN_ACN_ARBN" />
                ) : (
                  <NormalText />
                )}
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
                    <Option value="provider">Provider</Option>
                    <Option value="salary">Salary</Option>
                    <Option value="property">Property</Option>
                    <Option value="Loan_Mortgage_Rent_Billing">
                      Loan/Mortgage/Rent/Billing
                    </Option>
                    <Option value="investment">Investment</Option>
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
                  {editing ? <Input placeholder="Other" /> : <NormalText />}
                </Form.Item>
              </Col>
            )}
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
            <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
          </Row>

          <h1 className={styles.title}>Primary Account Holder</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Name"
                name="accountHolderName"
                initialValue={data?.accountHolderName}
              >
                {editing ? (
                  <Input placeholder="Account Holder Name" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Position"
                name="accountHolderPosition"
                initialValue={data?.accountHolderPosition}
              >
                {editing ? (
                  <Input placeholder="Account Holder Position" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="DOB"
                name="accountHolderDOB"
                initialValue={
                  data?.accountHolderDOB && moment(data?.accountHolderDOB)
                }
              >
                <DatePicker
                  disabled={!editing}
                  style={{ width: '100%' }}
                  placeholder="Account Holder DOB"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Contact Number"
                name="accountHolderContactNumber"
                initialValue={data?.accountHolderContactNumber}
              >
                {editing ? (
                  <Input placeholder="Account Holder Number" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="E-mail"
                name="accountHolderEmail"
                initialValue={data?.accountHolderEmail}
                required
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Please Enter Correct Email!',
                  },
                ]}
              >
                {editing ? (
                  <Input placeholder="Account Holder Email" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Address"
                name="accountHolderResidentialAddress"
                initialValue={data?.accountHolderResidentialAddress}
              >
                {editing ? (
                  <Input placeholder="Account Holder Residential Address" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
          </Row>
          <h1 className={styles.title}>Attachment Files</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Person1 Expire Date"
                name="person1ExpireDate"
                initialValue={
                  data?.person1ExpireDate && moment(data?.person1ExpireDate)
                }
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Person2 Expire Date"
                name="person2ExpireDate"
                initialValue={
                  data?.person2ExpireDate && moment(data?.person2ExpireDate)
                }
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Legal Person1 Front" name="legalPerson1front" initialValue={data?.legalPerson1front}>
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Legal Person1 Back" name="legalPerson1back" initialValue={data?.legalPerson1back}>
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Legal Person2 Front" name="legalPerson2front" initialValue={data?.legalPerson2front}>
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Legal Person2 Back" name="legalPerson2back" initialValue={data?.legalPerson2back}>
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Company Extract" name="companyExtract">
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Signature" name="signature">
                <UploadPicture disabled={!editing} />
              </Form.Item>
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
