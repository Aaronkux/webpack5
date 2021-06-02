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
  InputNumber,
  DatePicker,
  Radio,
  Switch,
} from 'antd';
import UploadPicture from '@/components/UploadPicture';
import { CloseCircleOutlined } from '@ant-design/icons';
import { addIndividualClient } from '@/services/clients';
import type { IndividualClientInfo } from '@/services/clients';
import type { Moment } from 'moment';
import { createFormData, isBlob, imageFileProcesser } from '@/utils';
import styles from './Create.less';

const { Option } = Select;

interface PropsType {
  newVisible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  fetchIndividualClients: () => void;
}
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormIndividualClientInfo = Merge<
  Partial<IndividualClientInfo>,
  {
    DOB: Moment;
    id1ExpireDate: Moment;
    id2ExpireDate: Moment;
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
  fetchIndividualClients,
}: PropsType) {
  const [showOther, setShowOther] = useState(false);
  const [form] = Form.useForm();
  const { loading: adding, run } = useRequest(addIndividualClient, {
    manual: true,
    onSuccess: () => {
      message.success('Add Successfully');
      fetchIndividualClients();
      onCancelHandler();
    },
  });
  const finishHandler = async (values: FormIndividualClientInfo) => {
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
      other,
    } = values;
    const tempData = {
      ...values,
      ...{
        DOB: DOB?.format('YYYY-MM-DD'),
        id1ExpireDate: id1ExpireDate?.format('YYYY-MM-DD'),
        id2ExpireDate: id2ExpireDate?.format('YYYY-MM-DD'),
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
    run(createFormData(tempData));
  };

  const onCancelHandler = () => {
    form.resetFields();
    setNewVisible(false);
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
        <h1 className={styles.title}>Basic</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="Name"
              name="name"
              required
              rules={[{ required: true, message: 'Please Enter Your Name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Gender" name="gender" initialValue={1} required>
              <Radio.Group>
                <Radio.Button value={1}>Male</Radio.Button>
                <Radio.Button value={0}>Female</Radio.Button>
              </Radio.Group>
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
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item
              label="DOB"
              name="DOB"
              required
              rules={[
                {
                  required: true,
                  message: 'Please Enter Your Date Of Birth!',
                },
              ]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Salesman" name="salesman">
              <Select showSearch allowClear>
                <Option value={'123321'}>James</Option>
                <Option value={'132213'}>Lebron</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Occupation" name="occupation">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="EmployerName" name="employerName">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="AnnualIncome" name="annualIncome">
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) => {
                  if (value === '0') {
                    return '';
                  }
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }}
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                precision={2}
                step="1"
                stringMode
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="SourceOfIncome" name="sourceOfIncome">
              <Input />
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
        </Row>

        <h1 className={styles.title}>Address</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Suburb" name="suburb">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="State" name="state">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Country" name="country">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Postcode" name="postcode">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <h1 className={styles.title}>Attachment File</h1>
        <Divider />
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="ID1 Front" name="id1front">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="ID1 Back" name="id1back">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="ID2 Front" name="id2front">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="ID2 Back" name="id2back">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="ID1 Expire Date" name="id1ExpireDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="ID2 Expire Date" name="id2ExpireDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="Face" name="faceImage">
              <UploadPicture />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Form.Item label="FaceTest" name="faceTest">
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
