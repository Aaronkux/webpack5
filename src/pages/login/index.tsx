import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRequest, useModel } from 'umi';
import { Form, Input, Button, Checkbox } from 'antd';
import store from 'store';

import { login } from '@/services/user';

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
      store.set('user', data.users);
      history.replace('/')
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
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
        <Input />
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
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => run('test', 'test')}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
