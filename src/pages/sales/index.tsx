import React, { useState } from 'react';
import { Button, Col, Row } from 'antd';
import SalesCard from './SalesCard';
import EditAndCreate from './EditAndCreate';
import styles from './index.less';

const salesInfo = {
  id: '123',
  name: 'Aaron Wo',
  email: 'aaronwo@awardglobal.com.au',
  active: true,
  photo:
    'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
};

export default function Sales() {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.container}>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <SalesCard salesInfo={salesInfo} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <SalesCard salesInfo={salesInfo} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <SalesCard salesInfo={salesInfo} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <SalesCard salesInfo={salesInfo} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <SalesCard salesInfo={salesInfo} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <SalesCard salesInfo={salesInfo} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <SalesCard salesInfo={salesInfo} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <SalesCard salesInfo={salesInfo} />
        </Col>
      </Row>
      <Button type='primary' onClick={() => setVisible(true)} >New</Button>
      <EditAndCreate visible={visible} setVisible={setVisible} />
    </div>
  );
}
