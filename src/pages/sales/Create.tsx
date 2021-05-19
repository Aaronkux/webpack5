import React, { useState } from 'react';
import { useDispatch } from 'umi';
import { Modal, Form, Input, Switch, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { isBlob, createFormData } from '@/utils';
import type { ParamsObjType } from '@/hooks/useURLParams';
import { addSale } from '@/services/sales';
import Avatar from '@/components/Avatar';
import styles from './Create.less';

interface PropsType {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  urlState: ParamsObjType
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const imageFileProcesser = (file: any) => {
  if (isBlob(file)) {
    return file;
  } else {
    return undefined;
  }
};

export default function Create({ visible, setVisible, urlState }: PropsType) {
  const [form] = Form.useForm();
  const [adding, setAdding] = useState(false);
  const dispatch = useDispatch()

  const onFinishHandler = async (values: any) => {
    setAdding(true);
    const { photo } = values;
    const tempData = {
      ...values,
      ...{
        photo: imageFileProcesser(photo),
      },
    };
    const res = await addSale(createFormData(tempData));
    setAdding(false);
    if (res.success) {
      message.success('Add Successfully!');
      dispatch({
        type: 'sales/queryAll',
        payload: { current: urlState.current, pageSize: urlState.pageSize },
      });
      onCancelHandler();
    }
    
  };

  const onCancelHandler = () => {
    form.resetFields();
    setVisible(false);
  };
  return (
    <Modal
      centered
      visible={visible}
      closeIcon={<CloseCircleOutlined />}
      onOk={() => form.submit()}
      onCancel={onCancelHandler}
      maskClosable={false}
      okText={'Add'}
      cancelText="Cancel"
      className={styles.container}
      width={520}
      confirmLoading={adding}
    >
      <Form
        {...layout}
        className={styles.form}
        form={form}
        onFinish={onFinishHandler}
      >
        <Form.Item label="Photo" name="photo" required rules={[{ required: true, message: 'Please upload your avatar!' }]}>
          <Avatar />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          required
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="E-mail"
          name="email"
          required
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please enter a valid email!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Active "
          name="status"
          valuePropName="checked"
          initialValue={true}
          required
        >
          <Switch checkedChildren="active" unCheckedChildren="inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
