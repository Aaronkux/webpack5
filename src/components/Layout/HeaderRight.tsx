import React, { useState } from 'react';
import { useHistory, useRequest } from 'umi';
import { Avatar, Dropdown, Menu, Modal, Skeleton } from 'antd';
import AuthImg from '@/components/AuthImg';
import { CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import store from 'store';
import { getUserDetail } from '@/services/users';
import Setting from './Setting';
import styles from './HeaderRight.less';

export default function HeaderRight() {
  const user = store.get('user');
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const { data: userData, loading, run: getSelf } = useRequest(getUserDetail, {
    manual: true,
  });
  const menu = (
    <Menu className={styles.menu}>
      <Menu.Item
        onClick={() => {
          store.remove('user');
          history.replace('/login');
        }}
      >
        Sign out
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setVisible(true);
          getSelf(user.id);
        }}
      >
        Setting
      </Menu.Item>
    </Menu>
  );
  const onCancelHandler = () => {
    setVisible(false);
  };
  return (
    <div className={styles.container}>
      {user && (
        <Dropdown placement="bottomCenter" overlay={menu}>
          <AuthImg size={32} path={user.photo} isAvatar />
        </Dropdown>
      )}
      <Modal
        closeIcon={<CloseCircleOutlined />}
        width={520}
        centered
        visible={visible}
        footer={null}
        onCancel={onCancelHandler}
      >
        {loading ? (
          <Skeleton active avatar />
        ) : (
          <Setting userData={userData} onCancelHandler={onCancelHandler} />
        )}
      </Modal>
    </div>
  );
}
