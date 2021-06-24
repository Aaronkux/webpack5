import React, { useEffect } from 'react';
import { Modal, Skeleton, message } from 'antd';
import { useRequest } from 'umi';
import { CloseCircleOutlined } from '@ant-design/icons';
import type { SalesInfo } from '@/services/sales';
import { querySale, updateSale } from '@/services/sales';
import { createFormData, imageFileProcesser } from '@/utils';
import EditForm from './components/EditForm';
import styles from './Edit.less';

interface PropsType {
  saleId?: string;
  visible: boolean;
  setSaleId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  fetchSales: () => void;
}

type FormSaleInfo = Partial<SalesInfo>;

export default function Edit({
  saleId,
  visible,
  setSaleId,
  setEditing,
  fetchSales,
}: PropsType) {
  const { data, loading, run: getSale } = useRequest(querySale, {
    manual: true,
    onSuccess: () => {},
  });
  
  const { loading: updating, run: update } = useRequest(updateSale, {
    manual: true,
    onSuccess: () => {
      message.success('Update Successfully!');
      fetchSales();
      onCancelHandler();
    },
  });
  const onFinishHandler = async (values: FormSaleInfo) => {
    if (!saleId) {
      message.error(`Can't Find Id Of The Receiver!`);
      return;
    }
    if (!data) {
      message.error(`Data Hasn't Fetched!`);
      return;
    }
    const { photo } = values;
    const tempData = {
      ...values,
      ...{
        photo: imageFileProcesser(photo),
      },
    };
    update(saleId, createFormData(tempData));
  };

  const onCancelHandler = () => {
    setSaleId(undefined);
    setEditing(false);
  };
  useEffect(() => {
    if (saleId && visible) {
      getSale(saleId);
    }
  }, [saleId, visible]);
  return (
    <Modal
      centered
      visible={visible}
      closeIcon={<CloseCircleOutlined />}
      footer={null}
      onCancel={onCancelHandler}
      maskClosable={true}
      className={styles.container}
      width={520}
      confirmLoading={updating}
    >
      {loading ? (
        <Skeleton active avatar />
      ) : (
        <EditForm data={data} onCancelHandler={onCancelHandler} saving={loading} onFinishHandler={onFinishHandler} />
      )}
    </Modal>
  );
}
