import React, { useState, useEffect } from 'react';
import { Card, Avatar, Skeleton, Popover, Tag } from 'antd';
import { EditOutlined, AccountBookOutlined } from '@ant-design/icons';
import styles from './SalesCard.less';
import { SalesInfo } from '@/services/sales';

interface PropsType {
  salesInfo: SalesInfo;
  loading: boolean;
  onCardClick: React.MouseEventHandler<HTMLDivElement>;
}

export default function SalesCard({
  salesInfo,
  loading,
  onCardClick,
}: PropsType) {
  const tagColor = salesInfo.isActive ? '#2db7f5' : '#f50';
  const tagText = salesInfo.isActive ? 'active' : 'inactive';

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
          <AccountBookOutlined
            onClick={(e) => {
              console.log('click orders');
            }}
            key="setting"
          />
        </Popover>,
        <Popover content="edit">
          <EditOutlined onClick={onCardClick} key="edit" />
        </Popover>,
      ]}
    >
      <Skeleton
        className={styles.skeleton}
        paragraph={{ rows: 5 }}
        loading={loading}
        active
        avatar
      >
        <Avatar className={styles.avatar} src={salesInfo.photo} />
        <div className={styles.name}>{salesInfo.name}</div>
        <div className={styles.email}>{salesInfo.email}</div>
        <Tag color={tagColor}>{tagText}</Tag>
      </Skeleton>
    </Card>
  );
}
