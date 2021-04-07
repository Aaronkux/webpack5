import React, { useState, useEffect } from 'react';
import { Card, Avatar, Skeleton, Popover, Tag } from 'antd';
import { EditOutlined, AccountBookOutlined } from '@ant-design/icons';
import styles from './SalesCard.less';
import { SalesInfo } from '@/services/sales';
//test
function delay(cb: () => void, time: number) {
  setTimeout(cb, time);
}

interface PropsType {
  salesInfo: SalesInfo;
}

export default function SalesCard({ salesInfo }: PropsType) {
  const tagColor = salesInfo.active ? '#2db7f5' : '#f50';
  const tagText = salesInfo.active ? 'active' : 'inactive';
  // test
  const [loading, setLoading] = useState(true);
  // test
  useEffect(() => {
    delay(() => setLoading(false), 1000);
  }, []);
  return (
    <Card
      hoverable
      className={styles.container}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      actions={[
        <Popover content="orders">
            <AccountBookOutlined key="setting" />
        </Popover>,
        <Popover content="edit">
          <EditOutlined key="edit" />
        </Popover>,
      ]}
    >
      <Skeleton loading={loading} active avatar>
        <Avatar className={styles.avatar} src={salesInfo.photo} />
        <div className={styles.name}>{salesInfo.name}</div>
        <div className={styles.email}>{salesInfo.email}</div>
        <Tag color={tagColor}>{tagText}</Tag>
      </Skeleton>
    </Card>
  );
}
