import React, { useState } from 'react';
import { useHistory } from 'umi';
import { Avatar, Dropdown, Menu, Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import store from 'store';
import Setting from './Setting';
import styles from './HeaderRight.less';

export default function HeaderRight() {
  const user = store.get('user');
  const [visible, setVisible] = useState(false);
  const history = useHistory();
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
      <Menu.Item onClick={() => setVisible(true)}>Setting</Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.container}>
      {user && (
        <Dropdown placement="bottomCenter" overlay={menu}>
          <Avatar src={user.photo} />
        </Dropdown>
      )}
      <Modal
        closeIcon={<CloseCircleOutlined />}
        width={1300}
        centered
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <Setting />
      </Modal>
    </div>
  );
}
