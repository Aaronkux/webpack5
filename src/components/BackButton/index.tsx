import React from 'react';
import { LeftCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import styles from './index.less'

export default function index() {
  const history = useHistory()
  return (
    <LeftCircleOutlined
      onClick={() => history.goBack()}
      className={styles.back}
    />
  );
}
