import React from 'react';
import { Link } from 'umi';
import { Card, Skeleton, Popover, Tag } from 'antd';
import AuthImg from '@/components/AuthImg';
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
          <Link to={`/order?salesmanId=${salesInfo.id}`}>
            <AccountBookOutlined key="order" />
          </Link>
        </Popover>,
        <Popover content="edit">
          <EditOutlined onClick={onCardClick} key="edit" />
        </Popover>,
      ]}
    >
      <Skeleton loading={loading} active avatar>
        <AuthImg path={salesInfo.photo} />
        <div className={styles.name}>{salesInfo.name}</div>
        <div className={styles.email}>{salesInfo.email}</div>
        <Tag color={tagColor}>{tagText}</Tag>
      </Skeleton>
    </Card>
  );
}
