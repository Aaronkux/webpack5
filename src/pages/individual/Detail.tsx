import React, { useState } from 'react';
import { Card, Menu } from 'antd';
import Personal from './components/personal';
import Beneficiary from './components/beneficiary';
import useURLParams from '@/hooks/useURLParams';
import styles from './Detail.less';

export default function Detail() {
  const [urlState, setURL] = useURLParams();
  const [showOther, setShowOther] = useState(false);
  return (
    <div className={styles.container}>
      <Card className={styles.formContainer}>
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
        {urlState.p === 'remitter' ? (
          <Personal showOther={showOther} setShowOther={setShowOther} />
        ) : (
          <Beneficiary />
        )}
      </Card>
    </div>
  );
}
