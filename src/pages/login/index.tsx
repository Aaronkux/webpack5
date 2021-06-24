import React from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { useRequest } from 'umi';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import store from 'store';
import type { UserInfo } from '@/services/users';
import { login } from '@/services/users';
import logo from '@/assets/gplogo.png';
import styles from './index.less';

export default function Login() {
  const history = useHistory();
  const { run } = useRequest(login, {
    manual: true,
    onSuccess: (res) => {
      let access: string[] = [];
      const {
        id,
        name,
        username,
        photo,
        token,
        isAdmin,
        salesPermission,
        clientPermission,
        orderPermission,
        emailPermission,
      } = res as UserInfo;
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
      if (isAdmin) {
        access.push('isAdmin');
      }
      store.set('user', { id, name, username, access, photo });
      store.set('token', token);
      history.replace('/');
    },
  });

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
        onFinish={(values)=>run(values.username, values.password)}
        className={styles.form}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
              type: 'email',
            },
          ]}
        >
          <Input placeholder="Email" className={styles.input} />
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
          <Input.Password
            placeholder="Password"
            className={styles.input}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
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
