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
} from 'antd';
import { connect, useDispatch, useRouteMatch } from 'umi';
import type { ClientsModelState, Loading } from 'umi';
import moment from 'moment';
import NormalText from '@/components/NormalText';
import UploadPicture from '@/components/UploadPicture';
import type { IndividualClientInfo } from '@/services/clients';
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
}

const Personal = ({
  showOther,
  setShowOther,
  individualClientDetail,
  loading,
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
  return (
    <>
      {!loading ? (
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={(values) => console.log(values)}
        >
          <div className={styles.titleAndButton}>
            <h1 className={styles.title}>Basic</h1>
            <Row gutter={[16, 0]} justify="end">
              <Col>
                <Button
                  type="primary"
                  htmlType="reset"
                  onClick={() => form.resetFields()}
                >
                  Reset
                </Button>
              </Col>
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
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
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
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Gender" name="gender" initialValue={0}>
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
                label="DOB"
                name="dob"
                initialValue={moment(individualClientDetail?.DOB)}
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="E-mail"
                name="email"
                initialValue="sadad@awadaw.com"
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Salesman"
                name="salesman"
                initialValue={individualClientDetail?.salesname}
              >
                {editing ? <Input /> : <NormalText />}
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
                initialValue={individualClientDetail?.annualIncome}
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
                initialValue={individualClientDetail?.unsubscribeue}
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
                label="Front"
                name="id1front"
                initialValue={individualClientDetail?.id1front}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Back"
                name="id1back"
                initialValue={individualClientDetail?.id1back}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Face"
                name="faceimage"
                initialValue={individualClientDetail?.faceImage}
              >
                <UploadPicture disabled={!editing} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="FaceTest"
                name="facetest"
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
                name="id1expiredate"
                initialValue={moment(
                  individualClientDetail?.id1ExpireDatereDate,
                )}
              >
                <DatePicker disabled={!editing} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]} justify="end">
            <Col>
              <Button
                type="primary"
                htmlType="reset"
                onClick={() => form.resetFields()}
              >
                Reset
              </Button>
            </Col>
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
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
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
export default connect(
  ({ clients, loading }: { clients: ClientsModelState; loading: Loading }) => ({
    individualClientDetail: clients.individualClientDetail,
    loading: loading.models.clients,
  }),
)(React.memo(Personal));
