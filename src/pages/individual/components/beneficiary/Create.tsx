import React, { useState } from 'react';
import { request, useDispatch, useRouteMatch, useRequest } from 'umi';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Divider,
  Row,
  Col,
  InputNumber,
  DatePicker,
  message,
} from 'antd';
import type {Moment} from 'moment'
import {addBeneficiary} from '@/services/clients'
import type {BeneficiaryInfo} from '@/services/clients'
import { CloseCircleOutlined } from '@ant-design/icons';
import UploadPicture from '@/components/UploadPicture';
import type { ParamsObjType } from '@/hooks/useURLParams';
import styles from './Create.less';

const { Option } = Select;

interface PropsType {
  visible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setURL: React.Dispatch<React.SetStateAction<ParamsObjType>>;
  getBeneficiaries: () => void;
}

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormIndividualReceiverInfo = Merge<
  Partial<BeneficiaryInfo>,
  {
    DOB: Moment;
    clientId: string
  }
>;


const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export default function Create({ setURL, visible, setNewVisible, getBeneficiaries }: PropsType) {
  const dispatch = useDispatch();
  const [method, setMethod] = useState(0);
  const [remitType, setRemitType] = useState(0);
  const [accountType, setAccountType] = useState(0);
  const [form] = Form.useForm();
  const match = useRouteMatch<{ id?: string }>();
  const clientTypeMatch = useRouteMatch<{ type?: string }>('/clients/:type');
  const { id } = match.params;

  const onCancelHandler = ()=> {
    setNewVisible(false);
      form.resetFields();
  }

  const { loading: adding, run } = useRequest(addBeneficiary, {
    manual: true,
    onSuccess: () => {
      message.success('Add Successfully');
      getBeneficiaries();
      onCancelHandler();
    },
  });


  const onFinishHandler = async (values: FormIndividualReceiverInfo) => {
    const clientType = clientTypeMatch?.params.type;
    if (!clientType || !id) {
      message.error('Error URL PATH!');
      return;
    }
    const res = await request('/api/addBeneficiary', {
      method: 'post',
      data: values,
    });
    if (res.success) {
      message.success('Adding Successfully!');
      setNewVisible(false);
      form.resetFields();

      if (id) {
        await dispatch({
          type: 'clients/getIndividualBeneficiaries',
          payload: { id },
        });
        setURL({ q: undefined });
      }
    }
  };

  return (
    <Modal
      centered
      width={1300}
      visible={visible}
      closeIcon={<CloseCircleOutlined />}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        setNewVisible(false);
        form.resetFields();
        setRemitType(0);
        setMethod(0);
        setAccountType(0);
      }}
      maskClosable={false}
      okText={'Add'}
      cancelText="Cancel"
      confirmLoading={adding}
    >
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={onFinishHandler}
      >
        <h1 className={styles.title}>Create Beneficiary</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Method"
              name="method"
              rules={[{ required: true, message: 'Please Select Option!' }]}
              initialValue={0}
            >
              <Radio.Group onChange={(v) => setMethod(v.target.value)}>
                <Radio value={0}>Add New Beneficiary</Radio>
                <Radio value={1}>From Existing Beneficiary</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>

          {method === 1 && (
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Beneficiary"
                name="beneficiary"
                required
                rules={[{ required: true, message: 'Please Select Option!' }]}
              >
                <Select showSearch optionFilterProp="children">
                  <Option value={'individual'}>Individual</Option>
                  <Option value={'company'}>Company</Option>
                </Select>
              </Form.Item>
            </Col>
          )}
          {method === 0 && (
            <>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Type"
                  name="receiverType"
                  required
                  rules={[
                    { required: true, message: 'Please Select Receiver Type!' },
                  ]}
                  initialValue={0}
                >
                  <Select onChange={(value: number) => setRemitType(value)}>
                    <Option value={0}>Remit to my personal account</Option>
                    <Option value={1}>Remit to other's account</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="Bank Name"
                  name="bankName"
                  required
                  rules={[
                    { required: true, message: 'Please Enter Bank Name!' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="Account Name"
                  name="accountName"
                  required
                  rules={[
                    { required: true, message: 'Please Enter Account Name' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="Account Number"
                  name="accountNumber"
                  required
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      message: 'Please Enter Account Number',
                    },
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} step="1" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="BSB"
                  name="bsb"
                  required
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      message: 'Please Enter BSB Number',
                    },
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} step="1" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="Branch Name"
                  name="branchName"
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Branch Name',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {remitType === 1 && (
                <>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter Receiver Name',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item label="DOB" name="DOB" required>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="Address"
                      name="address"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter DOB',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="Suburb"
                      name="suburb"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter Suburb',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="State"
                      name="state"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter State',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="Postcode"
                      name="postcode"
                      required
                      rules={[
                        {
                          required: true,
                          type: 'number',
                          message: 'Please Enter Postcode',
                        },
                      ]}
                    >
                      <InputNumber style={{ width: '100%' }} step="1" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="Country"
                      name="country"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter Country',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="Occupation"
                      name="occupation"
                      required
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter Occupation',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item label="Phone" name="phone">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item label="Relationship" name="relationship">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="Account Type"
                      name="isTrustAccount"
                      initialValue={0}
                    >
                      <Select
                        onChange={(value: 0 | 1) => setAccountType(value)}
                      >
                        <Option value={0}>Non-Trust Account</Option>
                        <Option value={1}>Trust Account</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {accountType === 1 ? (
                    <>
                      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Form.Item label="Company Name" name="companyName">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Form.Item
                          label="Company Address"
                          name="companyAddress"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Form.Item label="Company ABN" name="companyABN">
                          <InputNumber style={{ width: '100%' }} step="1" />
                        </Form.Item>
                      </Col>
                    </>
                  ) : (
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}></Col>
                  )}
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item label="ID Front" name="idFront">
                      <UploadPicture />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item label="ID Back" name="idBack">
                      <UploadPicture />
                    </Form.Item>
                  </Col>
                </>
              )}
            </>
          )}
        </Row>
      </Form>
    </Modal>
  );
}
