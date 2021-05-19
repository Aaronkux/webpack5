import React, { useEffect, useState } from 'react';
import {
  Skeleton,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Button,
  Divider,
  Modal,
  Switch,
  Select,
  message,
} from 'antd';
import { connect, useDispatch, useRouteMatch } from 'umi';
import type { ClientsModelState, Loading } from 'umi';
import moment from 'moment';
import type { Moment } from 'moment';
import NormalText from '@/components/NormalText';
import UploadPicture from '@/components/UploadPicture';
import type { CompanyClientInfo } from '@/services/clients';
import { updateIndividualClientsDetail } from '@/services/clients';
import { isBlob, createFormData } from '@/utils';
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

interface PropsType {
  companyClientDetail?: CompanyClientInfo;
  loading: boolean;
}

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormClientInfo = Merge<
  Omit<Partial<CompanyClientInfo>, 'salesman' | 'gender'>,
  {
    DOB: Moment;
    id1expiredate: Moment;
    gender: 0 | 1;
  }
>;

const imageFileProcesser = (file: any) => {
  if (isBlob(file)) {
    return file;
  } else if (file?.status === 'removed') {
    return null;
  } else {
    return undefined;
  }
};

const Personal = ({ companyClientDetail, loading }: PropsType) => {
  const [form] = Form.useForm();
  const match = useRouteMatch<{ id?: string }>();
  const dispatch = useDispatch();
  const [showOther, setShowOther] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = match.params;
  useEffect(() => {
    if (id) {
      dispatch({
        type: 'clients/getCompanyClientsDetail',
        payload: { id },
      });
    }
  }, [id]);
  useEffect(() => {
    if (companyClientDetail?.purpose) {
      if (!purposeOptions.includes(companyClientDetail?.purpose)) {
        setShowOther(true);
      }
    }
  }, [companyClientDetail]);

  const onFinishHandler = async (values: FormClientInfo) => {
    if (!id) {
      message.error(`Can't Find Id Of The Receiver`);
      return;
    }
    setUpdating(true);
    const { DOB, id1expiredate, gender } = values;
    const formatDOB = DOB?.format('YYYY-MM-DD');
    const formatId1expiredate = id1expiredate?.format('YYYY-MM-DD');
    const tempData = {
      ...values,
      ...{
        DOB: formatDOB,
        gender: gender === 1 ? true : false,
        id1expiredate: formatId1expiredate,
      },
    };
    const res = await updateIndividualClientsDetail(id, createFormData(tempData));
    setUpdating(false);
    if (res.success) {
      message.success('Update Successfully!');
      setEditing(false);
      await dispatch({
        type: 'clients/getCompanyClientsDetail',
        payload: { id },
      });
      form.resetFields();
    }
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
                initialValue={companyClientDetail?.name}
                required
                rules={[
                  { required: true, message: 'Please Enter Your Entity Name!' },
                ]}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Entity Type"
                name="companyType"
                initialValue={companyClientDetail?.companyType}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Registered Business Address"
                name="registeredBusinessAddress"
                initialValue={companyClientDetail?.registeredBusinessAddress}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Principle Business Address"
                name="principleBusinessAddress"
                initialValue={companyClientDetail?.principleBusinessAddress}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Company Contact Number"
                name="companyContactNumber"
                initialValue={companyClientDetail?.companyContactNumber}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="E-mail"
                name="email"
                initialValue={companyClientDetail?.email}
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
                label="ABN_ACN_ARBN"
                name="ABN_ACN_ARBN"
                initialValue={companyClientDetail?.ABN_ACN_ARBN}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Salesman"
                name="salesman"
                initialValue={companyClientDetail?.salesman?.name}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>

           
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID1 Expire Date"
                name="person1ExpireDate"
                initialValue={moment(companyClientDetail?.person1ExpireDate)}
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID2 Expire Date"
                name="person2ExpireDate"
                initialValue={moment(companyClientDetail?.person2ExpireDate)}
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID1 Front"
                name="legalPerson1front"
                initialValue={companyClientDetail?.legalPerson1front}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID1 Back"
                name="legalPerson1back"
                initialValue={companyClientDetail?.legalPerson1back}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID2 Front"
                name="legalPerson2front"
                initialValue={companyClientDetail?.legalPerson2front}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID2 Back"
                name="legalPersion2back"
                initialValue={companyClientDetail?.legalPersion2back}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Company Extract"
                name="companyExtract"
                initialValue={companyClientDetail?.companyExtract}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Signature"
                name="signature"
                initialValue={companyClientDetail?.signature}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Purpose"
                name="purpose"
                initialValue={
                  companyClientDetail?.purpose
                    ? purposeOptions.includes(companyClientDetail?.purpose)
                      ? companyClientDetail?.purpose
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
                label="unsubscribe"
                name="Unsubscribe"
                valuePropName="checked"
                initialValue={companyClientDetail?.unsubscribe}
              >
                <Switch disabled={!editing} />
              </Form.Item>
            </Col>
            {showOther && (
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Other"
                  name="other"
                  initialValue={companyClientDetail?.purpose}
                >
                  {editing ? <Input /> : <NormalText />}
                </Form.Item>
              </Col>
            )}
          </Row>
          <h1 className={styles.title}>Primary Account Holder</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Name"
                name="accountHolderName"
                initialValue={companyClientDetail?.accountHolderName}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Position"
                name="accountHolderPosition"
                initialValue={companyClientDetail?.accountHolderPosition}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Contact Number"
                name="accountHolderContactNumber"
                initialValue={companyClientDetail?.accountHolderContactNumber}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Email"
                name="accountHolderEmail"
                initialValue={companyClientDetail?.accountHolderEmail}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Residential Address"
                name="accountHolderResidentialAddress"
                initialValue={
                  companyClientDetail?.accountHolderResidentialAddress
                }
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="DOB"
                name="accountHolderDOB"
                initialValue={moment(companyClientDetail?.accountHolderDOB)}
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
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
export default connect(
  ({ clients, loading }: { clients: ClientsModelState; loading: Loading }) => ({
    companyClientDetail: clients.companyClientDetail,
    loading: loading.effects['clients/getCompanyClientsDetail']!,
  }),
)(React.memo(Personal));
