import React, { useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Divider,
  DatePicker,
  Select,
  Button,
  Modal,
  InputNumber,
  message,
} from 'antd';
import { useDispatch, useRouteMatch, connect } from 'umi';
import type { Loading, ClientsModelState } from 'umi';
import NormalText from '@/components/NormalText';
import UploadPicture from '@/components/UploadPicture';
import type { BeneficiaryInfo } from '@/services/clients';
import moment from 'moment';
import type { Moment } from 'moment';
import styles from './Detail.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 19 },
};
interface PropsType {
  data: BeneficiaryInfo;
  savingLoading: boolean;
}

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormBeneficiaryInfo = Merge<
  Omit<Partial<BeneficiaryInfo>, 'companyClient' | 'individualClient'>,
  {
    DOB: Moment;
  }
>;

const Detail = ({ data, savingLoading }: PropsType) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [remitType, setRemitType] = useState(data.receiverType);
  const [accountType, setAccountType] = useState(data.isTrustAccount ? 1 : 0);
  const match = useRouteMatch<{ id?: string }>();
  const { id } = match.params;

  const onFinishHandler = (values: FormBeneficiaryInfo) => {
    if (!id) {
      message.error(`Can't Find Id Of The Receiver`);
    }
    const { DOB, receiverType, isTrustAccount } = values;
    const formatDOB = DOB.format('YYYY-MM-DD');
    const formatReceiverType = receiverType ? true : false;
    const formatIsTrustAccount = isTrustAccount ? true : false;
    const tempData = {
      id,
      ...values,
      ...{
        DOB: formatDOB,
        receiverType: formatReceiverType,
        isTrustAccount: formatIsTrustAccount,
      },
    };
    let formdata = new FormData();
    for (let [key, value] of Object.entries(tempData)) {
      if (value === undefined) continue;
      if (typeof value === 'number' || typeof value === 'boolean') {
        formdata.append(key, value.toString());
        continue;
      }
      formdata.append(key, value);
    }
    dispatch({
      type: 'clients/updateBeneficiaryDetail',
      payload: { id, data: formdata },
    });
  };

  return (
    <>
      <div className={styles.content}>
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={onFinishHandler}
        >
          <div className={styles.titleAndButton}>
            <h1 className={styles.title}>Beneficiary Information</h1>
            <Row gutter={[16, 0]} justify="end">
              {editing && (
                <Col>
                  <Form.Item>
                    <Button
                      loading={savingLoading}
                      type="primary"
                      htmlType="submit"
                    >
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
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Type"
                name="receiverType"
                initialValue={data.receiverType ? 1 : 0}
                required
                rules={[
                  { required: true, message: 'Please Select Receiver Type' },
                ]}
              >
                {editing ? (
                  <Select onChange={(value: string) => setRemitType(!!value)}>
                    <Option value={0}>Remit to my personal account</Option>
                    <Option value={1}>Remit to other's account</Option>
                  </Select>
                ) : (
                  <NormalText
                    transform={(value) =>
                      value
                        ? 'Remit to my personal account'
                        : `Remit to other's account`
                    }
                  />
                )}
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Bank Name"
                name="bankName"
                initialValue={data.bankName}
                required
                rules={[
                  { required: true, message: 'Please Select Receiver Type' },
                ]}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Account Name"
                name="accountName"
                initialValue={data.accountName}
                required
                rules={[
                  { required: true, message: 'Please Enter Account Name' },
                ]}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Account Number"
                name="accountNumber"
                initialValue={data.accountNumber}
                required
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Please Enter Account Number',
                  },
                ]}
              >
                {editing ? (
                  <InputNumber style={{ width: '100%' }} step="1" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="BSB"
                name="bsb"
                initialValue={data.bsb}
                required
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Please Enter BSB Number',
                  },
                ]}
              >
                {editing ? (
                  <InputNumber style={{ width: '100%' }} step="1" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Branch Name"
                name="branchName"
                initialValue={data.branchName}
                required
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Branch Name',
                  },
                ]}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            {remitType && (
              <>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Name"
                    name="name"
                    initialValue={
                      data.individualClient
                        ? data.individualClient?.name
                        : data.companyClient?.name
                    }
                    required
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Receiver Name',
                      },
                    ]}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="DOB"
                    name="DOB"
                    initialValue={moment(data.DOB)}
                    required
                  >
                    <DatePicker disabled={!editing} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Address"
                    name="address"
                    initialValue={data.address}
                    required
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter DOB',
                      },
                    ]}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Suburb"
                    name="suburb"
                    initialValue={data.suburb}
                    required
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Suburb',
                      },
                    ]}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="State"
                    name="state"
                    initialValue={data.state}
                    required
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter State',
                      },
                    ]}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Postcode"
                    name="postcode"
                    initialValue={data.postcode}
                    required
                    rules={[
                      {
                        required: true,
                        type: 'number',
                        message: 'Please Enter Postcode',
                      },
                    ]}
                  >
                    {editing ? (
                      <InputNumber style={{ width: '100%' }} step="1" />
                    ) : (
                      <NormalText />
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Country"
                    name="country"
                    initialValue={data.country}
                    required
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Country',
                      },
                    ]}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Occupation"
                    name="occupation"
                    initialValue={data.occupation}
                    required
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Occupation',
                      },
                    ]}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    initialValue={data.phone}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Relationship"
                    name="relationship"
                    initialValue={data.relationship}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
              </>
            )}
            {remitType && (
              <>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Account Type"
                    name="isTrustAccount"
                    initialValue={data.isTrustAccount ? 1 : 0}
                  >
                    {editing ? (
                      <Select
                        onChange={(value: 0 | 1) => setAccountType(value)}
                      >
                        <Option value={0}>Non-Trust Account</Option>
                        <Option value={1}>Trust Account</Option>
                      </Select>
                    ) : (
                      <NormalText
                        transform={(value) =>
                          value === 0 ? 'Non-Trust Account' : 'Trust Account'
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
                {accountType === 1 ? (
                  <>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                      <Form.Item
                        label="Company Name"
                        name="companyName"
                        initialValue={data.trustAccountCompanyName}
                      >
                        {editing ? <Input /> : <NormalText />}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                      <Form.Item
                        label="Company Address"
                        name="companyAddress"
                        initialValue={data.trustAccountCompanyAddress}
                      >
                        {editing ? <Input /> : <NormalText />}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                      <Form.Item
                        label="Company ABN"
                        name="companyABN"
                        initialValue={data.trustAccountCompanyABN}
                      >
                        {editing ? (
                          <InputNumber style={{ width: '100%' }} step="1" />
                        ) : (
                          <NormalText />
                        )}
                      </Form.Item>
                    </Col>
                  </>
                ) : (
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}></Col>
                )}
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="ID Front"
                    name="idFront"
                    initialValue={data.idFront}
                  >
                    <UploadPicture disabled={!editing} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="ID Back"
                    name="idBack"
                    initialValue={data.idBack}
                  >
                    <UploadPicture disabled={!editing} />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <Row gutter={[16, 0]} justify="end">
            {editing && (
              <Col>
                <Form.Item>
                  <Button
                    loading={savingLoading}
                    type="primary"
                    htmlType="submit"
                  >
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
      </div>
      <Modal
        centered
        title="Unsaved confirm"
        visible={modalVisible}
        onOk={() => {
          form.resetFields();
          setEditing(false);
          setModalVisible(false);
          setRemitType(data.receiverType);
        }}
        onCancel={() => setModalVisible(false)}
      >
        <p>All unsaved changes will be discharged.</p>
      </Modal>
    </>
  );
};

// export default React.memo(Detail);

export default connect(
  ({ clients, loading }: { clients: ClientsModelState; loading: Loading }) => ({
    savingLoading: loading.effects['clients/updateBeneficiaryDetail']!,
  }),
)(React.memo(Detail));
