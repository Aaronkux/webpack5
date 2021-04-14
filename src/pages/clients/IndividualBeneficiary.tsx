import React, { useState } from 'react';
import {
  Menu,
  Form,
  Input,
  Row,
  Col,
  Divider,
  DatePicker,
  Tag,
  Select,
} from 'antd';
import { useLocation, useHistory } from 'react-router-dom';
import moment from 'moment';
import styles from './IndividualBeneficiary.less';
import { search2Param, param2Search } from '@/utils';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 19 },
};

let mockData: any[] = [];

for (let i = 0; i < 10; i++) {
  mockData.push({
    key: i.toString(),
    name: 'aaron',
    type: 0,
    address: `${i} test Rd asd,  sa dsa dsadsadsada`,
    suburb: 'Burwood',
    state: 'NSW',
    country: 'Australia',
    phone: '0401836846',
  });
}

const data = [
  {
    key: '0',
    type: 0,
    bankName: 'ANZ',
    accountName: 'aaron',
    accountNumber: 123456,
    bsb: '123456',
    branchName: 'Parramata',
  },
  {
    key: '1',
    type: 1,
    name: 'aaron',
    dob: moment('1999/1/1'),
    address: '1 st Rd',
    suburb: 'test',
    state: 'test',
    postcode: '12345',
    country: 'china',
    phone: '12321412',
    occupation: 'teacher',
    relationship: 'friend',
    bankName: 'CommonWealth',
    accountName: 'aaron',
    accountNumber: 123456,
    bsb: '123456',
    branchName: 'Parramata',
  },
];

export default function IndividualBeneficiary() {
  const [form] = Form.useForm();
  const location = useLocation();
  const history = useHistory();
  let params = search2Param(location.search);
  const selectedParam = params.q
    ? params.q
    : mockData[0]?.key?.toString() ?? null;
  const [remitType, setRemitType] = useState(data[0].type);
  return (
    <div className={styles.container}>
      <Menu defaultSelectedKeys={[selectedParam]} className={styles.subNav}>
        {mockData.map((item) => (
          <Menu.Item
            onClick={() => {
              params.q = item.key;
              history.replace(location.pathname + param2Search(params));
            }}
            key={item.key}
          >
            <div className={styles.navCard}>
              <p
                className={styles.navCountry}
              >{`${item.country}, ${item.state}`}</p>
              <p
                className={styles.address}
              >{`${item.address}, ${item.suburb}`}</p>
              <p className={styles.contact}>{`${item.name} ${item.phone}`}</p>
              {item.type === 0 ? <Tag className={styles.selfTag} color="#f50">Self</Tag> : ''}
            </div>
          </Menu.Item>
        ))}
      </Menu>
      <Divider className={styles.divider} type="vertical" />
      <div className={styles.content}>
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={(values) => console.log(values)}
        >
          <h1 className={styles.title}>Remit Info</h1>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="Type" name="type" initialValue={0}>
                <Select onChange={(value: number) => setRemitType(value)}>
                  <Option value={0}>Remit to my personal account</Option>
                  <Option value={1}>Remit to other's account</Option>
                </Select>
              </Form.Item>
            </Col>
            {remitType === 1 ? (
              <>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item label="Name" name="name" initialValue="aaron">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="DOB"
                    name="dob"
                    initialValue={moment('1999/1/1')}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Address"
                    name="address"
                    initialValue="aaron"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item label="Suburb" name="suburb" initialValue="aaron">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item label="State" name="state" initialValue="aaron">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Postcode"
                    name="postcode"
                    initialValue="aaron"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Country"
                    name="country"
                    initialValue="aaron"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item label="Phone" name="phone" initialValue="aaron">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Occupation"
                    name="occupation"
                    initialValue="aaron"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <Form.Item
                    label="Relationship"
                    name="relationship"
                    initialValue="aaron"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="Bank Name" name="bankName" initialValue="aaron">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Account Name"
                name="accountName"
                initialValue="aaron"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Account Number"
                name="accountNumber"
                initialValue="aaron"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="BSB" name="bsb" initialValue="aaron">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Branch Name"
                name="branchName"
                initialValue="aaron"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
