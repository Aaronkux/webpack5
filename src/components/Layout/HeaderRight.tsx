import React from 'react';
import { useHistory } from 'umi';
import { Avatar, Dropdown, Menu } from 'antd';
import store from 'store';

import styles from './HeaderRight.less';

export default function HeaderRight() {
  const { photo } = store.get('user');
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
    </Menu>
  );
  return (
    <div className={styles.container}>
      <Dropdown placement="bottomCenter" overlay={menu}>
        <Avatar src={photo} />
      </Dropdown>
    </div>
  );
}
