import React from 'react';
import { Divider } from 'antd';
import Detail from './Detail';
import NavBar from './NavBar';
import styles from './index.less';

export default function Beneficiary() {
  return (
    <div className={styles.container}>
      <NavBar />
      <Divider className={styles.divider} type="vertical" />
      <Detail />
    </div>
  );
}
