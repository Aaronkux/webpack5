import React, { useState } from 'react';
import { useRouteMatch, useRequest } from 'umi';
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
import type { Moment } from 'moment';
import {
  addBeneficiary,
  updateCompanyClientsDetail,
  getSearchBeneficiaries,
} from '@/services/clients';
import type { BeneficiaryInfo } from '@/services/clients';
import { CloseCircleOutlined } from '@ant-design/icons';
import UploadPicture from '@/components/UploadPicture';
import type { ParamsObjType } from '@/hooks/useURLParams';
import { imageFileProcesser, createFormData } from '@/utils/index';
import styles from './Create.less';

const { Option } = Select;

interface PropsType {
  visible: boolean;
  setNewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setURL: React.Dispatch<React.SetStateAction<ParamsObjType>>;
  getBeneficiaries: () => void;
  data: BeneficiaryInfo[] | undefined;
}

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormIndividualReceiverInfo = Merge<
  Partial<BeneficiaryInfo>,
  {
    DOB: Moment | undefined;
    idExpireDate: Moment | undefined;
    method: 0 | 1;
    idFront: File | undefined | string;
    idBack: File | undefined | string;
    relatedDoc: File | undefined | string;
    beneficiary: any;
  }
>;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export default function Create({
  visible,
  setNewVisible,
  getBeneficiaries,
  data,
}: PropsType) {
  const [method, setMethod] = useState(0);
  const [remitType, setRemitType] = useState(2);
  const [form] = Form.useForm();
  const match = useRouteMatch<{ id?: string }>();
  const { id } = match.params;
  const ids = data?.map((item) => item.id) ?? [];

  const onCancelHandler = () => {
    setNewVisible(false);
    setMethod(0);
    setRemitType(2);
    form.resetFields();
  };

  const { loading: adding, run } = useRequest(addBeneficiary, {
    manual: true,
    onSuccess: () => {
      message.success('Add Successfully');
      getBeneficiaries();
      onCancelHandler();
    },
  });

  const {
    loading: addExistingLoading,
    run: addExistingBeneficiary,
  } = useRequest(updateCompanyClientsDetail, {
    manual: true,
    onSuccess: () => {
      message.success('Add Successfully');
      getBeneficiaries();
      onCancelHandler();
    },
  });

  //working on this
  const {
    data: searchReceiversData,
    loading: receiversLoading,
    run: searchReceivers,
  } = useRequest(getSearchBeneficiaries, {
    manual: true,
    debounceInterval: 500,
    formatResult: (res) => res.data?.data,
  });

  const onFinishHandler = (values: FormIndividualReceiverInfo) => {
    if (!id) {
      message.error('Error URL PATH!');
      return;
    }
    const {
      method,
      idExpireDate,
      idFront,
      idBack,
      DOB,
      receiverType,
      beneficiary,
      relatedDoc,
      ...rest
    } = values;
    // add existing beneficiary
    if (method === 1) {
      const tempData = {
        receiver: data
          ? JSON.stringify([...data.map((item) => item.id), beneficiary])
          : JSON.stringify([beneficiary]),
      };
      addExistingBeneficiary(id, createFormData(tempData));
    } else {
      const tempData = {
        ...rest,
        DOB: DOB?.format('YYYY-MM-DD'),
        idExpireDate: idExpireDate?.format('YYYY-MM-DD'),
        receiverType: remitType ?? 2,
        companyClient: id,
        idFront: imageFileProcesser(idFront),
        idBack: imageFileProcesser(idBack),
        relatedDoc: imageFileProcesser(relatedDoc),
      };
      run(createFormData(tempData));
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
        setRemitType(2);
        setMethod(0);
      }}
      maskClosable={false}
      okText={'Add'}
      cancelText="Cancel"
      confirmLoading={adding || addExistingLoading}
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

          {method === 1 && id && (
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Beneficiary"
                name="beneficiary"
                required
                rules={[
                  { required: true, message: 'Please Select Beneficiary!' },
                ]}
              >
                <Select
                  loading={receiversLoading}
                  onSearch={(val) => searchReceivers(val)}
                  showSearch
                  optionFilterProp="children"
                >
                  {searchReceiversData
                    ?.filter((item) => !ids.includes(item.id))
                    .map((val) => (
                      <Option key={val.id} value={val.id}>
                        {val.name}
                      </Option>
                    ))}
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
                  initialValue={remitType}
                >
                  <Select onChange={(value: number) => setRemitType(value)}>
                    <Option value={2}>Remit to personal account</Option>
                    <Option value={3}>Remit to company's account</Option>
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

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  // required
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please Enter Receiver Name',
                  //   },
                  // ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item label="DOB" name="DOB">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="Address"
                  name="address"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please Enter DOB',
                  //   },
                  // ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="Suburb"
                  name="suburb"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please Enter Suburb',
                  //   },
                  // ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="State"
                  name="state"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please Enter State',
                  //   },
                  // ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="Postcode"
                  name="postcode"
                  // rules={[
                  //   {
                  //     required: true,
                  //     type: 'number',
                  //     message: 'Please Enter Postcode',
                  //   },
                  // ]}
                >
                  <InputNumber style={{ width: '100%' }} step="1" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Form.Item
                  label="Country"
                  name="country"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please Enter Country',
                  //   },
                  // ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {remitType === 2 && (
                <>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item
                      label="Occupation"
                      name="occupation"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please Enter Occupation',
                      //   },
                      // ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </>
              )}
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
              {remitType === 3 && (
                <>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}></Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <Form.Item label="Related Doc" name="relatedDoc">
                      <UploadPicture />
                    </Form.Item>
                  </Col>
                </>
              )}
              {remitType === 2 && (
                <>
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
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item label="ID Expire Date" name="idExpireDate">
                      <DatePicker style={{ width: '100%' }} />
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
