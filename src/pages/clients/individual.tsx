import React from 'react';
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
} from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import { search2Param, param2Search, ParamsObjType } from '@/utils';
import Filter from './components/filter';
import styles from './individual.less';

const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

export default function Individual() {
  const [form] = Form.useForm();
  const location = useLocation();
  const history = useHistory();
  let params = search2Param(location.search);
  const selectedParam = params.p ? params.p : 'remitter';
  return (
    <div>
      <Card className={styles.filterContainer}>
        <Filter />
      </Card>
      <Card>
        <Menu defaultSelectedKeys={[selectedParam]} mode="horizontal">
          <Menu.Item
            onClick={() => {
              params.p = 'remitter';
              history.replace(location.pathname + param2Search(params));
            }}
            key="remitter"
          >
            Remitter
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              params.p = 'beneficiary';
              history.replace(location.pathname + param2Search(params));
            }}
            key="beneficiary"
          >
            Beneficiary
          </Menu.Item>
        </Menu>
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={(values) => console.log(values)}
        >
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
                label="EmployeeName"
                name="employeeName"
                initialValue="tony"
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
                style={{width: '100%'}}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                  step="0.01"
                  stringMode
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
