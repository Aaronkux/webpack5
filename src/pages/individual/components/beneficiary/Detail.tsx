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
} from 'antd';
import NormalText from '../normalText';
import UploadPicture from '@/components/UploadPicture';
import type { BeneficiaryInfo } from '@/services/clients';
import moment from 'moment';
import styles from './Detail.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 19 },
};
interface PropsType {
  data: BeneficiaryInfo;
}

const Detail = ({ data }: PropsType) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [remitType, setRemitType] = useState(data.type);
  const [accountType, setAccountType] = useState(data.isTrustAccount ? 1 : 0);
  return (
    <>
      <div className={styles.content}>
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={(values) => console.log(values)}
        >
          <div className={styles.titleAndButton}>
            <h1 className={styles.title}>Beneficiary Information</h1>
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
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="Type" name="type" initialValue={data.type}>
                {editing ? (
                  <Select onChange={(value: 0 | 1) => setRemitType(value)}>
                    <Option value={0}>Remit to my personal account</Option>
                    <Option value={1}>Remit to other's account</Option>
                  </Select>
                ) : (
                  <NormalText
                    transform={(value) =>
                      value === 0
                        ? 'Remit to my personal account'
                        : `Remit to other's account`
                    }
                  />
                )}
              </Form.Item>
            </Col>
            {remitType === 1 && (
              <>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item label="Name" name="name" initialValue={data.name}>
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="DOB"
                    name="dob"
                    initialValue={moment(data.DOB)}
                  >
                    <DatePicker disabled={!editing} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Address"
                    name="address"
                    initialValue={data.address}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Suburb"
                    name="suburb"
                    initialValue={data.suburb}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="State"
                    name="state"
                    initialValue={data.state}
                  >
                    {editing ? <Input /> : <NormalText />}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Postcode"
                    name="postcode"
                    initialValue={data.postcode}
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
                    label="Occupation"
                    name="occupation"
                    initialValue={data.occupation}
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
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Bank Name"
                name="bankName"
                initialValue={data.bankName}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Account Name"
                name="accountName"
                initialValue={data.accountName}
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Account Number"
                name="accountNumber"
                initialValue={data.accountNumber}
              >
                {editing ? (
                  <InputNumber style={{ width: '100%' }} step="1" />
                ) : (
                  <NormalText />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="BSB" name="bsb" initialValue={data.bsb}>
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
              >
                {editing ? <Input /> : <NormalText />}
              </Form.Item>
            </Col>
            {remitType === 1 && (
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
                        initialValue={data.companyName}
                      >
                        {editing ? <Input /> : <NormalText />}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                      <Form.Item
                        label="Company Address"
                        name="companyAddress"
                        initialValue={data.companyAddress}
                      >
                        {editing ? <Input /> : <NormalText />}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                      <Form.Item
                        label="Company ABN"
                        name="companyABN"
                        initialValue={data.companyABN}
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
      </div>
      <Modal
        centered
        title="Unsaved confirm"
        visible={modalVisible}
        onOk={() => {
          form.resetFields();
          setEditing(false);
          setModalVisible(false);
          setRemitType(0);
        }}
        onCancel={() => setModalVisible(false)}
      >
        <p>All unsaved changes will be discharged.</p>
      </Modal>
    </>
  );
};

export default React.memo(Detail);
