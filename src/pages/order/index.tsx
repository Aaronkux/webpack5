import React, { useState } from 'react';
import { Link } from 'umi';
import { Row, Button, Table, Card, Popover, Avatar, Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import Filter from './Filter';
import styles from './index.less';
import edit from '@/assets/edit.svg';

const orderedStage = [
  'compliance',
  'fundNotified',
  'fundReceived',
  'confirmationSent',
  'clientConfirmed',
  'fundPaid',
];

const getColorAndIcon = (position: number, currentStage: number) => {
  if (position > currentStage) {
    return {
      color: 'warning',
      icon: <ClockCircleOutlined />,
    };
  } else if (position < currentStage) {
    return {
      color: 'success',
      icon: <CheckCircleOutlined />,
    };
  } else {
    return { color: 'processing', icon: <SyncOutlined /> };
  }
};

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    fixed: 'left' as 'left',
    width: 50,
    render: (stage: any, record: any, index: number) => index + 1,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left' as 'left',
    width: 80,
  },
  { title: 'Referral', dataIndex: 'referral', key: 'referral', width: 100 },
  {
    title: 'From Currency',
    dataIndex: 'fromCurrency',
    key: 'fromCurrency',
    width: 100,
  },
  {
    title: 'From Amount',
    dataIndex: 'fromAmount',
    key: 'fromAmount',
    width: 100,
  },
  {
    title: 'To Currency',
    dataIndex: 'toCurrency',
    key: 'toCurrency',
    width: 100,
  },
  { title: 'To Amount', dataIndex: 'toAmount', key: 'toAmount', width: 100 },
  {
    title: 'Exchange Rate',
    dataIndex: 'exchangeRate',
    key: 'exchangeRate',
    width: 100,
  },
  { title: 'BaseRate', dataIndex: 'baseRate', key: 'baseRate', width: 100 },
  { title: 'Comment', dataIndex: 'comment', key: 'comment', width: 100 },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    width: 120,
  },
  {
    title: 'Special Consideration',
    dataIndex: 'specialConsideration',
    key: 'specialConsideration',
    width: 130,
  },
  {
    title: 'Dispensing Bank',
    dataIndex: 'dispensingBank',
    key: 'dispensingBank',
    width: 120,
  },
  { title: 'Receiver', dataIndex: 'receiver', key: 'receiver', width: 100 },
  {
    title: 'Stage',
    dataIndex: 'stage',
    key: 'stage',
    width: 300,
    fixed: 'right' as 'right',
    render: (stage: any, record: any) => {
      let currentStage = 0;
      for (let i = 0; i < orderedStage.length; i++) {
        if (
          stage[orderedStage[i]] === false &&
          i > 0 &&
          stage[orderedStage[i - 1]] === true
        ) {
          currentStage = i;
          break;
        }
        if (i === 5 && stage[orderedStage[i]] === true) {
          currentStage = 6;
        }
      }

      return (
        <div style={{ display: 'flex' }}>
          <div>
            {orderedStage.slice(0, 3).map((text, index) => {
              const { color, icon } = getColorAndIcon(index, currentStage);
              return (
                <Tag
                  style={{ marginBottom: '5px' }}
                  key={index}
                  icon={icon}
                  color={color}
                >
                  {text}
                </Tag>
              );
            })}
          </div>
          <div>
            {orderedStage.slice(3).map((text, index) => {
              const { color, icon } = getColorAndIcon(index + 3, currentStage);
              return (
                <Tag
                  style={{ marginBottom: '5px' }}
                  key={index}
                  icon={icon}
                  color={color}
                >
                  {text}
                </Tag>
              );
            })}
          </div>
        </div>
      );
    },
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    align: 'center' as 'center',
    fixed: 'right' as 'right',
    render: (text: string, record: any) => {
      return (
        <Link to={`/order/${record.id}`}>
          <Popover content={'edit'}>
            <img src={edit} alt="logo" />
          </Popover>
        </Link>
      );
    },
  },
];

const data = [
  {
    id: '1123213',
    name: 'aaron',
    referral: 'test',
    fromCurrency: 'test',
    fromAmount: 'test',
    toCurrency: 'test',
    toAmount: 'test',
    exchangeRate: 'test',
    baseRate: 'test',
    comment: 'test',
    department: 'test',
    specialConsideration: 'test',
    dispensingBank: 'test',
    receiver: 'receiver',
    stage: {
      compliance: true,
      fundNotified: true,
      fundReceived: true,
      confirmationSent: false,
      clientConfirmed: false,
      fundPaid: false,
    },
  },
  {
    id: '23213213',
    name: 'aaron',
    referral: 'test',
    fromCurrency: 'test',
    fromAmount: 'test',
    toCurrency: 'test',
    toAmount: 'test',
    exchangeRate: 'test',
    baseRate: 'test',
    comment: 'test',
    department: 'test',
    specialConsideration: 'test',
    dispensingBank: 'test',
    receiver: 'receiver',
    stage: {
      compliance: false,
      fundNotified: false,
      fundReceived: false,
      confirmationSent: false,
      clientConfirmed: false,
      fundPaid: false,
    },
  },
  {
    id: '2321321313213',
    name: 'aaron',
    referral: 'test',
    fromCurrency: 'test',
    fromAmount: 'test',
    toCurrency: 'test',
    toAmount: 'test',
    exchangeRate: 'test',
    baseRate: 'test',
    comment: 'test',
    department: 'test',
    specialConsideration: 'test',
    dispensingBank: 'test',
    receiver: 'receiver',
    stage: {
      compliance: true,
      fundNotified: true,
      fundReceived: true,
      confirmationSent: true,
      clientConfirmed: true,
      fundPaid: true,
    },
  },
  {
    id: '232134214213',
    name: 'aaron',
    referral: 'test',
    fromCurrency: 'test',
    fromAmount: 'test',
    toCurrency: 'test',
    toAmount: 'test',
    exchangeRate: 'test',
    baseRate: 'test',
    comment: 'test',
    department: 'test',
    specialConsideration: 'test',
    dispensingBank: 'test',
    receiver: 'receiver',
    stage: {
      compliance: true,
      fundNotified: true,
      fundReceived: true,
      confirmationSent: true,
      clientConfirmed: true,
      fundPaid: false,
    },
  },
  {
    id: '23213211233',
    name: 'aaron',
    referral: 'test',
    fromCurrency: 'test',
    fromAmount: 'test',
    toCurrency: 'test',
    toAmount: 'test',
    exchangeRate: 'test',
    baseRate: 'test',
    comment: 'test',
    department: 'test',
    specialConsideration: 'test',
    dispensingBank: 'test',
    receiver: 'receiver',
    stage: {
      compliance: true,
      fundNotified: true,
      fundReceived: false,
      confirmationSent: false,
      clientConfirmed: false,
      fundPaid: false,
    },
  },
];

export default function Order() {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.container}>
      <Card className={styles.filterContainer}>
        <Filter setVisible={setVisible} />
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1500 }}
          sticky
          rowKey="id"
        />
      </Card>
    </div>
  );
}
