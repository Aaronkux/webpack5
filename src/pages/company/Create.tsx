import React, { useState } from 'react';
import { useRequest } from 'umi';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  message,
  Select,
  Divider,
  DatePicker,
  Switch,
} from 'antd';
import UploadPicture from '@/components/UploadPicture';
import { CloseCircleOutlined } from '@ant-design/icons';
import { addCompanyClient } from '@/services/clients';
import { queryAllSalesByName } from '@/services/sales';
import type { CompanyClientInfo } from '@/services/clients';
import type { Moment } from 'moment';
import { createFormData, imageFileProcesser } from '@/utils';
import styles from './Create.less';

const { Option } = Select;

interface PropsType {
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  fetchCompanyClients: () => void;
}
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormCompanyClientInfo = Merge<
  Omit<Partial<CompanyClientInfo>, 'receiver'>,
  {
    accountHolderDOB: Moment;
    person1ExpireDate: Moment;
    person2ExpireDate: Moment;
    salesman: string;
    purpose: string;
    other: string;
  }
>;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export default function Create({
  newVisible,
  setNewVisible,
  fetchCompanyClients,
}: PropsType) {
  const [form] = Form.useForm();
  const [showOther, setShowOther] = useState(false);
  const { loading: adding, run } = useRequest(addCompanyClient, {
    manual: true,
    onSuccess: () => {
      message.success('Add Successfully');
      fetchCompanyClients();
      onCancelHandler();
    },
  });
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
  const finishHandler = async (values: FormCompanyClientInfo) => {
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
      other,
      ...rest
    } = values;
    const tempData = {
      ...rest,
      ...{
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
    run(createFormData(tempData));
  };

  const onCancelHandler = () => {
    form.resetFields();
    mutate([]);
    setNewVisible(false);
  };
  const onSearchHandler = (val: string) => {
    if (val === '' && salesData?.length) {
      mutate([]);
    } else {
      querySales(val);
    }
  };

  return (
    <Modal
      visible={newVisible}
      width={1300}
      onCancel={onCancelHandler}
      onOk={form.submit}
      closeIcon={<CloseCircleOutlined />}
      maskClosable={false}
      centered
      className={styles.container}
      okText={'Add'}
      cancelText="Cancel"
      confirmLoading={adding}
    >
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={finishHandler}
      >
        <h1 className={styles.title}>Company Details</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Entity Name"
              name="name"
              required
              rules={[
                { required: true, message: 'Please Enter Your Entity Name!' },
              ]}
            >
              <Input placeholder="Entity Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Entity Type"
              name="companyType"
              required
              rules={[
                { required: true, message: 'Please Enter Your Entity Type!' },
              ]}
            >
              <Input placeholder="Entity Type" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Registered Address"
              name="registeredBusinessAddress"
              required
              rules={[
                {
                  required: true,
                  message: 'Please Enter Your Registered Address!',
                },
              ]}
            >
              <Input placeholder="Registered Business Address" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Principle Address"
              name="principleBusinessAddress"
              required
              rules={[
                {
                  required: true,
                  message: 'Please Enter Your Principle Address!',
                },
              ]}
            >
              <Input placeholder="Principle Business Address" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Contact Number"
              name="companyContactNumber"
              required
              rules={[
                {
                  required: true,
                  message: 'Please Enter Your Contact Number!',
                },
              ]}
            >
              <Input placeholder="Company Contact Number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="E-mail"
              name="email"
              required
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Please Enter Correct Email!',
                },
              ]}
            >
              <Input placeholder="Company Email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="ABN_ACN_ARBN"
              name="ABN_ACN_ARBN"
              required
              rules={[
                {
                  required: true,
                  message: 'Please Enter Your ABN_ACN_ARBN!',
                },
              ]}
            >
              <Input placeholder="ABN_ACN_ARBN" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Purpose" name="purpose">
              <Select
                allowClear
                showSearch
                onChange={(value) => {
                  if (value === 'other') {
                    setShowOther(true);
                  } else if (showOther === true) {
                    setShowOther(false);
                  }
                }}
                placeholder="Purpose"
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
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Unsubscribe"
              name="unsubscribe"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          {showOther && (
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Other" name="other">
                <Input />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Salesman" name="salesman">
              <Select
                showSearch
                allowClear
                placeholder="Salesman"
                optionFilterProp="children"
                loading={salesLoading}
                onSearch={onSearchHandler}
              >
                {salesData?.map((sale) => (
                  <Option key={sale.id} value={sale.id}>
                    {sale.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
        </Row>

        <h1 className={styles.title}>Primary Account Holder</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Name" name="accountHolderName">
              <Input placeholder="Account Holder Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Position" name="accountHolderPosition">
              <Input placeholder="Account Holder Position" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="DOB" name="accountHolderDOB">
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Account Holder DOB"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Contact Number" name="accountHolderContactNumber">
              <Input placeholder="Account Holder Number" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="E-mail"
              name="accountHolderEmail"
              required
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Please Enter Correct Email!',
                },
              ]}
            >
              <Input placeholder="Account Holder Email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Address" name="accountHolderResidentialAddress">
              <Input placeholder="Account Holder Residential Address" />
            </Form.Item>
          </Col>
        </Row>
        <h1 className={styles.title}>Attachment Files</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Person1 Expire Date" name="person1ExpireDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Person2 Expire Date" name="person2ExpireDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Legal Person1 Front" name="legalPerson1front">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Legal Person1 Back" name="legalPerson1back">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Legal Person2 Front" name="legalPerson2front">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Legal Person2 Back" name="legalPerson2back">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Company Extract" name="companyExtract">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Signature" name="signature">
              <UploadPicture />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
