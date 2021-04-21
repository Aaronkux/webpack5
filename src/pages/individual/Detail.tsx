import React, { useState } from 'react';
import { Card, Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import Personal from './Personal';
import Beneficiary from './Beneficiary';
import { search2Param, param2Search } from '@/utils';
import styles from './Detail.less';

export default function Detail() {
  const history = useHistory();
  let params = search2Param();
  const selectedParam = params.p ? params.p : 'remitter';
  const [isRemitter, setIsRemitter] = useState(
    () => selectedParam == 'remitter',
  );
  const [showOther, setShowOther] = useState(false);
  return (
    <div className={styles.container}>
      <Card className={styles.formContainer}>
        <Menu defaultSelectedKeys={[selectedParam]} mode="horizontal">
          <Menu.Item
            onClick={() => {
              params.p = 'remitter';
              history.replace(param2Search(params));
              setIsRemitter(true);
            }}
            key="remitter"
          >
            Remitter
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              params.p = 'beneficiary';
              history.replace(param2Search(params));
              setIsRemitter(false);
            }}
            key="beneficiary"
          >
            Beneficiary
          </Menu.Item>
        </Menu>
        {isRemitter ? (
          <Personal showOther={showOther} setShowOther={setShowOther} />
        ) : (
          <Beneficiary />
        )}
      </Card>
    </div>
  );
}
