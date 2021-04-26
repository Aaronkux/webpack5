import React, { useState } from 'react';
import { useHistory } from 'umi';
import { Card, Menu } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import Personal from './components/personal';
import Beneficiary from './components/beneficiary';
import useURLParams from '@/hooks/useURLParams';
import styles from './Detail.less';

export default function Detail() {
  const [urlState, setURL] = useURLParams();
  const [showOther, setShowOther] = useState(false);
  const history = useHistory();
  return (
    <div className={styles.container}>
      <Card className={styles.formContainer}>
        <LeftCircleOutlined
          onClick={() => history.goBack()}
          className={styles.back}
        />
        <Menu
          defaultSelectedKeys={[urlState.p ?? 'remitter']}
          mode="horizontal"
        >
          <Menu.Item
            onClick={() => {
              setURL({ p: 'remitter' });
            }}
            key="remitter"
          >
            Remitter
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setURL({ p: 'beneficiary' });
            }}
            key="beneficiary"
          >
            Beneficiary
          </Menu.Item>
        </Menu>
        {urlState.p === 'beneficiary' ? (
          <Beneficiary urlState={urlState} setURL={setURL} />
        ) : (
          <Personal showOther={showOther} setShowOther={setShowOther} />
        )}
      </Card>
    </div>
  );
}
