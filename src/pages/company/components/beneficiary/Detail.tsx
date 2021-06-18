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
  Popconfirm,
  message,
} from 'antd';
import { useRequest } from 'umi';
import NormalText from '@/components/NormalText';
import UploadPicture from '@/components/UploadPicture';
import type { BeneficiaryInfo } from '@/services/clients';
import moment from 'moment';
import type { Moment } from 'moment';
import styles from './Detail.less';
import { createFormData, imageFileProcesser } from '@/utils';
import {
  updateBeneficiaryDetail,
  updateCompanyClientsDetail,
} from '@/services/clients';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 19 },
};
interface PropsType {
  getBeneficiaries: () => void;
  data?: BeneficiaryInfo;
  allBeneficiaryIds: string[];
  clientId?: string;
  queryBeneficiaryDetail: () => void;
}

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormBeneficiaryInfo = Merge<
  Omit<Partial<BeneficiaryInfo>, 'companyClient' | 'individualClient'>,
  {
    method: 0 | 1;
    DOB: Moment | undefined;
    idExpireDate: Moment | undefined;
    idFront: File | undefined | string;
    idBack: File | undefined | string;
    relatedDoc: File | undefined | string;
    beneficiary: any;
  }
>;

const Detail = ({
  getBeneficiaries,
  data,
  allBeneficiaryIds,
  clientId,
  queryBeneficiaryDetail,
}: PropsType) => {
  const { loading: deleteLoading, run: deleteRecord } = useRequest(
    updateCompanyClientsDetail,
    {
      manual: true,
      onSuccess: () => {
        message.success('Delete Successfully!');
        getBeneficiaries();
      },
    },
  );

  const deleteBeneficiaryQuery = () => {
    if (data?.id && clientId) {
      let idsSet = new Set(allBeneficiaryIds);
      idsSet.delete(data.id);
      const resArr = Array.from(idsSet);
      deleteRecord(
        clientId,
        createFormData({
          receiver: JSON.stringify(resArr),
        }),
      );
    }
  };

  const { loading: savingLoading, run: saveRecord } = useRequest(
    updateBeneficiaryDetail,
    {
      manual: true,
      onSuccess: () => {
        message.success('Update Successfully!');
        setEditing(false);
        queryBeneficiaryDetail();
      },
      onError: () => {
        setEditing(false);
      },
    },
  );

  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [remitType, setRemitType] = useState(data?.receiverType);
  const id = data?.id;

  const onFinishHandler = async (values: FormBeneficiaryInfo) => {
    if (!id) {
      message.error(`Can't Find Id Of The Receiver`);
      setEditing(false);
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
    const tempData = {
      ...rest,
      DOB: DOB?.format('YYYY-MM-DD'),
      idExpireDate: idExpireDate?.format('YYYY-MM-DD'),
      receiverType: remitType ? 0 : 1,
      companyClient: id,
      idFront: imageFileProcesser(idFront),
      idBack: imageFileProcesser(idBack),
      relatedDoc: imageFileProcesser(relatedDoc),
    };
    saveRecord(id, createFormData(tempData));
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
              {!editing && (
                <Col>
                  <Form.Item>
                    <Popconfirm
                      title="Are you sure to delete this receiver?"
                      onConfirm={deleteBeneficiaryQuery}
                    >
                      <Button loading={deleteLoading} danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Form.Item>
                </Col>
              )}
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
                initialValue={remitType ? 0 : 1}
                required
                rules={[
                  {
                    required: true,
                    message: 'Please Select Receiver Type',
                  },
                ]}
              >
                <NormalText
                  transform={(value) =>
                    value
                      ? `Remit to personal account`
                      : `Remit to company's account`
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Bank Name"
                name="bankName"
                initialValue={data?.bankName}
                required
                rules={[{ required: true, message: 'Please Enter Bank Name!' }]}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Account Name"
                name="accountName"
                initialValue={data?.accountName}
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
                initialValue={data?.accountNumber}
                required
                rules={[
                  {
                    required: true,
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
                initialValue={data?.bsb}
                required
                rules={[
                  {
                    required: true,
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
                initialValue={data?.branchName}
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

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="Name" name="name" initialValue={data?.name}>
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="DOB"
                name="DOB"
                initialValue={data?.DOB ? moment(data?.DOB) : null}
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Address"
                name="address"
                initialValue={data?.address}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Suburb"
                name="suburb"
                initialValue={data?.suburb}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="State" name="state" initialValue={data?.state}>
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Postcode"
                name="postcode"
                initialValue={data?.postcode}
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
                initialValue={data?.country}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="Phone" name="phone" initialValue={data?.phone}>
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Relationship"
                name="relationship"
                initialValue={data?.relationship}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            {!remitType ? (
              <>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Occupation"
                    name="occupation"
                    initialValue={data?.occupation}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="ID Front"
                    name="idFront"
                    initialValue={data?.idFront}
                  >
                    <UploadPicture disabled={!editing} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="ID Back"
                    name="idBack"
                    initialValue={data?.idBack}
                  >
                    <UploadPicture disabled={!editing} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="ID Expire Date"
                    name="idExpireDate"
                    initialValue={
                      data?.idExpireDate ? moment(data.idExpireDate) : undefined
                    }
                  >
                    <DatePicker disabled={!editing} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </>
            ) : (
              <>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}></Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item label="Related Doc" name="relatedDoc">
                    <UploadPicture />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
          <Row gutter={[16, 0]} justify="end">
            {!editing && (
              <Col>
                <Form.Item>
                  <Popconfirm
                    title="Are you sure to delete this receiver?"
                    onConfirm={deleteBeneficiaryQuery}
                  >
                    <Button loading={deleteLoading} danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </Form.Item>
              </Col>
            )}
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
          setRemitType(data?.receiverType ?? false);
        }}
        onCancel={() => setModalVisible(false)}
      >
        <p>All unsaved changes will be discharged.</p>
      </Modal>
    </>
  );
};

// export default React.memo(Detail);

export default React.memo(Detail);
