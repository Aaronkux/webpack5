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
import { connect, useDispatch, useRouteMatch } from 'umi';
import type { ClientsModelState, Loading } from 'umi';
import moment from 'moment';
import type { Moment } from 'moment';
import NormalText from '@/components/NormalText';
import UploadPicture from '@/components/UploadPicture';
import type { IndividualClientInfo } from '@/services/clients';
import { isBlob } from '@/utils';
import styles from './index.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 19 },
};

interface PropsType {
  showOther: boolean;
  setShowOther: React.Dispatch<React.SetStateAction<boolean>>;
  individualClientDetail?: IndividualClientInfo;
  loading: boolean;
  savingLoading: boolean;
}

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

type FormClientInfo = Merge<
  Omit<Partial<IndividualClientInfo>, 'salesman' | 'gender'>,
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

const Personal = ({
  showOther,
  setShowOther,
  individualClientDetail,
  loading,
  savingLoading,
}: PropsType) => {
  const [form] = Form.useForm();
  const match = useRouteMatch<{ id?: string }>();
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = match.params;
  useEffect(() => {
    if (id) {
      dispatch({
        type: 'clients/getIndividualClientsDetail',
        payload: { id },
      });
    }
  }, [id]);

  const onFinishHandler = async (values: FormClientInfo) => {
    if (!id) {
      message.error(`Can't Find Id Of The Receiver`);
    }
    const {
      DOB,
      id1expiredate,
      id1front,
      id1back,
      id2front,
      id2back,
      faceImage,
      faceTest,
      signature,
      gender,
    } = values;
    const formatDOB = DOB?.format('YYYY-MM-DD');
    const formatId1expiredate = id1expiredate?.format('YYYY-MM-DD');
    const tempData = {
      id,
      ...values,
      ...{
        DOB: formatDOB,
        gender: gender === 1 ? true : false,
        id1expiredate: formatId1expiredate,
        id1front: imageFileProcesser(id1front),
        id1back: imageFileProcesser(id1back),
        id2front: imageFileProcesser(id2front),
        id2back: imageFileProcesser(id2back),
        faceImage: imageFileProcesser(faceImage),
        faceTest: imageFileProcesser(faceTest),
        signature: imageFileProcesser(signature),
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
    const res = await dispatch({
      type: 'clients/updateIndividualClientsDetail',
      payload: { id, data: formdata },
    });
    if (res) {
      setEditing(false);
      await dispatch({
        type: 'clients/getIndividualClientsDetail',
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
            <h1 className={styles.title}>Basic</h1>
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
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Name"
                name="name"
                initialValue={individualClientDetail?.name}
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
                initialValue={individualClientDetail?.gender ? 0 : 1}
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
                initialValue={individualClientDetail?.email}
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
                initialValue={moment(individualClientDetail?.DOB)}
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Salesman"
                name="salesman"
                initialValue={individualClientDetail?.salesman?.id}
              >
                {editing ? (
                  <Select>
                    <Option value={'123321'}>James</Option>
                    <Option value={'132213'}>Lebron</Option>
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
                initialValue={individualClientDetail?.occupation}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="EmployerName"
                name="employerName"
                initialValue={individualClientDetail?.employerName}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="AnnualIncome"
                name="annualIncome"
                initialValue={individualClientDetail?.annualIncome?.toFixed(2)}
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
                initialValue={individualClientDetail?.sourceOfIncome}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Purpose"
                name="purpose"
                initialValue={individualClientDetail?.purpose}
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
                initialValue={individualClientDetail?.unsubscribe}
              >
                <Switch disabled={!editing} />
              </Form.Item>
            </Col>
            {showOther ? (
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Other"
                  name="other"
                  initialValue={individualClientDetail?.other}
                >
                  {editing ? <Input /> : <NormalText />}
                </Form.Item>
              </Col>
            ) : (
              <></>
            )}
          </Row>

          <h1 className={styles.title}>Address</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Address"
                name="address"
                initialValue={individualClientDetail?.address}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Suburb"
                name="suburb"
                initialValue={individualClientDetail?.suburb}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="State"
                name="state"
                initialValue={individualClientDetail?.state}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Country"
                name="country"
                initialValue={individualClientDetail?.country}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Postcode"
                name="postcode"
                initialValue={individualClientDetail?.postcode}
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
                initialValue={individualClientDetail?.id1front}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID1 Back"
                name="id1back"
                initialValue={individualClientDetail?.id1back}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID2 Front"
                name="id2front"
                initialValue={individualClientDetail?.id2front}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="ID2 Back"
                name="id2back"
                initialValue={individualClientDetail?.id2back}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Face"
                name="faceImage"
                initialValue={individualClientDetail?.faceImage}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="FaceTest"
                name="faceTest"
                initialValue={individualClientDetail?.faceTest}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Signature"
                name="signature"
                initialValue={individualClientDetail?.signature}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Expire Date"
                name="id1ExpireDate"
                initialValue={moment(individualClientDetail?.id1ExpireDate)}
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
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
    individualClientDetail: clients.individualClientDetail,
    loading: loading.effects['clients/getIndividualClientsDetail']!,
    savingLoading: loading.effects['clients/updateIndividualClientsDetail']!,
  }),
)(React.memo(Personal));
