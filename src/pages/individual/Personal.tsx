import React, { useEffect } from 'react';
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
  Image,
} from 'antd';
import { connect, useDispatch, useRouteMatch } from 'umi';
import type { ClientsModelState, Loading } from 'umi';
import UploadPicture from '@/components/UploadPicture';
import type { IndividualClientInfo } from '@/services/clients';
import moment from 'moment';
import styles from './Personal.less';

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
  const { id } = match.params;
  useEffect(() => {
    if (id) {
      dispatch({
        type: 'clients/queryIndividualClientDetail',
        payload: { id },
      });
    }
  }, [id]);
  return (
    <>
      {individualClientDetail ? (
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={(values) => console.log(values)}
        >
          <h1 className={styles.title}>Basic</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Name"
                name="name"
                initialValue={individualClientDetail.name}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Gender" name="gender" initialValue={0}>
                <Radio.Group>
                  <Radio.Button value={0}>Male</Radio.Button>
                  <Radio.Button value={1}>Female</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="DOB"
                name="dob"
                initialValue={moment(individualClientDetail.DOB)}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="E-mail"
                name="email"
                initialValue="sadad@awadaw.com"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Salesman"
                name="salesman"
                initialValue={individualClientDetail.salesname}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Occupation"
                name="occupation"
                initialValue={individualClientDetail.occupation}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="EmployerName"
                name="employerName"
                initialValue={individualClientDetail.employerName}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="AnnualIncome"
                name="annualIncome"
                initialValue={individualClientDetail.annualIncome}
              >
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
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="SourceOfIncome"
                name="sourceOfIncome"
                initialValue={individualClientDetail.sourceOfIncome}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Purpose"
                name="purpose"
                initialValue={individualClientDetail.purpose}
              >
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
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="unsubscribe"
                name="Unsubscribe"
                valuePropName="checked"
                initialValue={individualClientDetail.unsubscribeue}
              >
                <Switch />
              </Form.Item>
            </Col>
            {showOther ? (
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Other"
                  name="other"
                  initialValue={individualClientDetail.other}
                >
                  <Input />
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
                initialValue={individualClientDetail.address}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Suburb"
                name="suburb"
                initialValue={individualClientDetail.suburb}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="State"
                name="state"
                initialValue={individualClientDetail.state}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Country"
                name="country"
                initialValue={individualClientDetail.country}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Postcode"
                name="postcode"
                initialValue={individualClientDetail.postcode}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <h1 className={styles.title}>Attachment File</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Front" name="id1front" initialValue={individualClientDetail.id1front}>
                <UploadPicture />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Back" name="id1back"  initialValue={individualClientDetail.id1back}>
              <UploadPicture />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Face" name="faceimage"  initialValue={individualClientDetail.faceImage}>
              <UploadPicture />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="FaceTest" name="facetest"  initialValue={individualClientDetail.faceTest}>
                <UploadPicture />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item label="Signature" name="signature"  initialValue={individualClientDetail.signature}>
              <UploadPicture />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Form.Item
                label="Expiredate"
                name="id1expiredate"
                initialValue={moment(
                  individualClientDetail.id1ExpireDatereDate,
                )}
              >
                <DatePicker style={{ width: '100%' }} />
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
    </>
  );
};
export default connect(
  ({ clients, loading }: { clients: ClientsModelState; loading: Loading }) => ({
    individualClientDetail: clients.individualClientDetail,
    loading: loading.models.clients,
  }),
)(React.memo(Personal));
