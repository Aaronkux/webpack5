import React, { useState } from 'react';
import {
  Card,
  Menu,
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
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import IndividualBeneficiary from './IndividualBeneficiary';
import { search2Param, param2Search } from '@/utils';
import styles from './Individual.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 19 },
};

export default function Individual() {
  const [form] = Form.useForm();
  const history = useHistory();
  let params = search2Param();
  const selectedParam = params.p ? params.p : 'remitter';
  const [isRemitter, setIsRemitter] = useState(
    () => selectedParam == 'remitter',
  );
  const [showOther, setShowOther] = useState(false);
  return (
    <div className={styles.container}>
      <Card className={styles.formContainer}>
        <Menu defaultSelectedKeys={[selectedParam]} mode="horizontal">
          <Menu.Item
            onClick={() => {
              params.p = 'remitter';
              history.replace(param2Search(params));
              setIsRemitter(true);
            }}
            key="remitter"
          >
            Remitter
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              params.p = 'beneficiary';
              history.replace(param2Search(params));
              setIsRemitter(false);
            }}
            key="beneficiary"
          >
            Beneficiary
          </Menu.Item>
        </Menu>
        {isRemitter ? (
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
                <Form.Item label="Name" name="name" initialValue="aaron">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Gender" name="gender" initialValue="male">
                  <Radio.Group>
                    <Radio.Button value="male">Male</Radio.Button>
                    <Radio.Button value="female">Female</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="DOB"
                  name="dob"
                  initialValue={moment('1999/1/1')}
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
                <Form.Item label="Salesman" name="salesman" initialValue="tom">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="Occupation"
                  name="occupation"
                  initialValue="worker"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="EmployerName"
                  name="employerName"
                  initialValue="Tony Lam"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  label="AnnualIncome"
                  name="annualIncome"
                  initialValue={11}
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
                  initialValue="Salary"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Purpose" name="purpose">
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
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Col>
              {showOther ? (
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item label="Other" name="other">
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
                <Form.Item label="Address" name="address" initialValue="test">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Suburb" name="suburb" initialValue="test">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="State" name="state" initialValue="test">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Country" name="country" initialValue="test">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Postcode" name="postcode" initialValue="test">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <h1 className={styles.title}>Attachment File</h1>
            <Divider />
            <Row>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Front" name="id1front">
                  <Image
                    preview={false}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                    width={200}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Back" name="id1back">
                  <Image
                    preview={false}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                    width={200}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Face" name="faceimage">
                  <Image
                    preview={false}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                    width={200}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="FaceTest" name="facetest">
                  <Image
                    preview={false}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                    width={200}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Signature" name="signature">
                  <Image
                    preview={false}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                    width={200}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Expiredate" name="id1expiredate">
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
          <IndividualBeneficiary />
        )}
      </Card>
    </div>
  );
}
