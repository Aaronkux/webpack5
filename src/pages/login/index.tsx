import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRequest } from 'umi';
import { Form, Input, Button } from 'antd';
import store from 'store';

import { login } from '@/services/users';
import logo from '@/assets/gplogo.png';
import styles from './index.less';

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
        photo,
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
      store.set('user', { firstname, lastname, email, access, photo });
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
      <img className={styles.logo} src={logo} alt="" />
      <h2 className={styles.title}>Global Pay Admin</h2>
      <Form
        requiredMark={false}
        name="basic"
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onFinishHandler}
        className={styles.form}
      >
        <Form.Item
          // label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input placeholder="Username" className={styles.input} />
        </Form.Item>

        <Form.Item
          // label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input
            placeholder="Password"
            type="password"
            className={styles.input}
          />
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
