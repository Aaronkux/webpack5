import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRequest } from 'umi';
import { Form, Input, Button, Card } from 'antd';
import store from 'store';

import { login } from '@/services/user';

import styles from './index.less';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function Login() {
  const history = useHistory();
  const { loading, run } = useRequest(login, {
    manual: true,
    onSuccess: (data) => {
      let access: string[] = [];
      const {
        firstname,
        lastname,
        email,
        salesPermission,
        clientPermission,
        orderPermission,
        emailPermission,
      } = data.users;
      if (salesPermission) {
        access.push('salesPermission');
      }
      if (clientPermission) {
        access.push('clientPermission');
      }
      if (orderPermission) {
        access.push('orderPermission');
      }
      if (emailPermission) {
        access.push('emailPermission');
      }
      store.set('user', { firstname, lastname, email, access });
      history.replace('/');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onFinishHandler = (values: any) => {
    run(values.username, values.password);
  };
  return (
    <div className={styles.container}>
      <Form
        requiredMark={false}
        name="basic"
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onFinishHandler}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input className={styles.input} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input type="password" className={styles.input} />
        </Form.Item>
        <Form.Item>
          <Button className={styles.loginBtn} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
