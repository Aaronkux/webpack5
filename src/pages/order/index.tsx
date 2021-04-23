import React, { useState } from 'react';
import { Link } from 'umi';
import { Row, Button, Table, Card, Popover, Avatar } from 'antd';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import styles from './index.less';
import edit from '@/assets/edit.svg';

const clientlistcolumns = [
  'compliance',
  'notified',
  'received',
  'comfirmed',
  'paid',
];

const dynamicColumns: {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  render: (text: string, record: any) => JSX.Element;
}[] = clientlistcolumns.map((value) => {
  const upperCase = value.charAt(0).toUpperCase() + value.slice(1);
  return {
    title: upperCase,
    dataIndex: value,
    key: value,
    width: 109,
    align: 'center',
    render: (text: any, record: any) => {
      switch (value) {
        case 'gender':
          return <>{parseInt(text) === 1 ? 'male' : 'female'}</>;
        default:
          if (text.img) {
            return <Avatar src={text.img} />;
          }
          return <SyncOutlined spin />;
      }
    },
  };
});
const operators = {
  title: 'Action',
  dataIndex: 'action',
  key: 'action',
  align: 'end',
  render: (text: string, record: any) => {
    return (
      <Link to={`/order/${record.id}`}>
        <Popover content={'edit'}>
          <img src={edit} alt="logo" />
        </Popover>
      </Link>
    );
  },
};
dynamicColumns.push(operators);

const data = [
  {
    key: 1,
    compliance: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    },
    notified: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    },
    received: {
      img: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    },
    comfirmed: {},
    paid: {},
  },
];

export default function Order() {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.container}>
      <Card>
        <Row justify="end" className={styles.addBar}>
          <Button type="primary" onClick={() => setVisible(true)}>
            New
          </Button>
        </Row>
      </Card>
      <Card>
        <Table columns={dynamicColumns} dataSource={data} />
      </Card>
    </div>
  );
}
