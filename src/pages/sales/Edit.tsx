import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, Skeleton, message } from 'antd';
import { useDispatch } from 'umi';
import { CloseCircleOutlined } from '@ant-design/icons';
import type { SalesInfo } from '@/services/sales';
import { querySale, updateSale } from '@/services/sales';
import { isBlob, createFormData } from '@/utils';
import type { ParamsObjType } from '@/hooks/useURLParams';
import Avatar from '@/components/Avatar';
import styles from './Edit.less';

interface PropsType {
  saleId?: string;
  visible: boolean;
  setSaleId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  urlState: ParamsObjType;
}

type FormSaleInfo = Partial<SalesInfo>;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const imageFileProcesser = (file: any) => {
  if (isBlob(file)) {
    return file;
  } else {
    return undefined;
  }
};

export default function Edit({
  saleId,
  visible,
  setSaleId,
  setEditing,
  urlState,
}: PropsType) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);
  const [data, setData] = useState<SalesInfo>();

  const onFinishHandler = async (values: FormSaleInfo) => {
    if (!saleId) {
      message.error(`Can't Find Id Of The Receiver!`);
      return;
    }
    if (!data) {
      message.error(`Data Hasn't Fetched!`);
      return;
    }
    setUpdating(true);
    const { photo } = values;
    const tempData = {
      ...values,
      ...{
        photo: imageFileProcesser(photo),
      },
    };
    const res = await updateSale(saleId, createFormData(tempData));
    setUpdating(false);
    if (res.success) {
      message.success('Update Successfully!');
      dispatch({
        type: 'sales/queryAll',
        payload: { current: urlState.current, pageSize: urlState.pageSize },
      });
      onCancelHandler();
    }
  };

  const onCancelHandler = () => {
    setSaleId(undefined);
    setEditing(false);
    setData(undefined);
  };
  useEffect(() => {
    const getSale = async (id: string) => {
      const res = await querySale(id);
      if (res.success) {
        setData(res.data);
      }
    };
    if (saleId) {
      getSale(saleId);
    }
  }, [saleId]);
  return (
    <Modal
      centered
      visible={visible}
      closeIcon={<CloseCircleOutlined />}
      onOk={() => form.submit()}
      onCancel={onCancelHandler}
      okText={'Save'}
      cancelText="Cancel"
      maskClosable={true}
      className={styles.container}
      width={520}
      confirmLoading={updating}
    >
      {!data ? (
        <Skeleton active avatar />
      ) : (
        <Form
          {...layout}
          className={styles.form}
          form={form}
          onFinish={onFinishHandler}
        >
          <Form.Item
            label="Photo"
            name="photo"
            initialValue={data?.photo}
            required
            rules={[{ required: true, message: 'Please upload your avatar!' }]}
          >
            <Avatar />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            initialValue={data?.name}
            required
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="E-mail"
            name="email"
            initialValue={data?.email}
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
            initialValue={data?.isActive}
            required
          >
            <Switch checkedChildren="active" unCheckedChildren="inactive" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
