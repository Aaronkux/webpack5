import React, { useState, useEffect } from 'react';
import { Link, useDispatch, connect, request } from 'umi';
import {
  Row,
  Pagination,
  Table,
  Card,
  Popover,
  Avatar,
  Tag,
  message,
  Popconfirm,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { OrderModelState, Loading } from 'umi';
import type { PaginationProps } from 'antd';
import useURLParams from '@/hooks/useURLParams';
import type { OrderInfo } from '@/services/order';
import store from 'store';
import Filter from './Filter';
import Create from './Create';
import styles from './index.less';
import edit from '@/assets/edit.svg';
import next from '@/assets/next.svg';
import del from '@/assets/del.svg';

type StageType =
  | 'compliance'
  | 'fundNotified'
  | 'fundReceived'
  | 'confirmationSent'
  | 'clientConfirmed'
  | 'fundPaid';

const orderedStage: StageType[] = [
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

const StagePopoverContent = ({
  name,
  photo,
}: {
  name: string;
  photo: string;
}) => {
  return (
    <Card
      style={{ width: '80px', height: '128px' }}
      bordered={false}
      bodyStyle={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Avatar src={photo} size={64} />
      <p style={{ marginTop: '10px', textAlign: 'center' }}>{name}</p>
    </Card>
  );
};

interface PropsType {
  orders: OrderInfo[];
  total: number;
  loading: boolean;
}

const Order = ({ orders, total, loading }: PropsType) => {
  const [urlState, setURL] = useURLParams();
  const onChangeHandler: PaginationProps['onChange'] = (page, pageSize) => {
    setURL({ current: page.toString(), pageSize: pageSize?.toString() });
  };
  const [actionLoading, setActionLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { id } = store.get('user');
  const nextHandler = async (orderId: string, stage: string) => {
    if (!stage) message.error('Already finished');
    setActionLoading(true);
    const res = await request(`/api/order/${id}`, {
      method: 'put',
      data: {
        [stage]: orderId,
      },
    });
    if (res.success) {
      message.success('Success');
      dispatch({
        type: 'orders/getOrders',
        payload: { current: urlState.current, pageSize: urlState.pageSize },
      });
    } else {
      message.error(res.errorMessage);
    }
    setActionLoading(false);
  };

  const deleteHandler = async (orderId: string) => {
    setActionLoading(true);
    const res = await request(`/api/order/${orderId}`, {
      method: 'delete',
    });
    if (res.success) {
      message.success('Success');
      dispatch({
        type: 'orders/getOrders',
        payload: { current: urlState.current, pageSize: urlState.pageSize },
      });
    } else {
      message.error(res.errorMessage);
    }
    setActionLoading(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left' as 'left',
      width: 60,
      render: (stage: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left' as 'left',
      width: 150,
      render: (_: any, record: OrderInfo) => record.clientInfo.name,
    },
    { title: 'Referral', dataIndex: 'referral', key: 'referral', width: 100 },
    {
      title: 'Salesman',
      dataIndex: 'salesman',
      key: 'salesman',
      className: styles.salesman,
      width: 120,
      render: (salesman: any, record: OrderInfo) => (
        <div>
          {' '}
          <Popover
            content={
              <StagePopoverContent
                name={record.salesman?.name ?? ''}
                photo={record.salesman?.photo ?? ''}
              />
            }
          >
            <span className={styles.salesman}>{record.salesman?.name}</span>
          </Popover>
        </div>
      ),
    },
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
    {
      title: 'Receiver',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 150,
      render: (stage: any, record: OrderInfo) => record.receiver.name,
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      width: 300,
      className: styles.stage,
      fixed: 'right' as 'right',
      render: (stage: any, record: OrderInfo) => {
        let currentStage = 0;
        for (let i = 0; i < orderedStage.length; i++) {
          if (
            !record[orderedStage[i]] &&
            i > 0 &&
            record[orderedStage[i - 1]]
          ) {
            currentStage = i;
            break;
          }
          if (i === 5 && record[orderedStage[i]]) {
            currentStage = 6;
          }
        }

        return (
          <div style={{ display: 'flex' }}>
            <div>
              {orderedStage.slice(0, 3).map((text, index) => {
                const { color, icon } = getColorAndIcon(index, currentStage);
                const { name, photo } = record[text] ?? {};
                return (
                  <Popover
                    key={index}
                    content={
                      <StagePopoverContent
                        name={name ?? ''}
                        photo={photo ?? ''}
                      />
                    }
                  >
                    <Tag
                      className={styles.tag}
                      key={index}
                      icon={icon}
                      color={color}
                    >
                      {text}
                    </Tag>
                  </Popover>
                );
              })}
            </div>
            <div>
              {orderedStage.slice(3).map((text, index) => {
                const { color, icon } = getColorAndIcon(
                  index + 3,
                  currentStage,
                );

                const { name, photo } = record[text] ?? {};
                return (
                  <div key={index + 3}>
                    {name ? (
                      <Popover
                        content={
                          <StagePopoverContent
                            name={name ?? ''}
                            photo={photo ?? ''}
                          />
                        }
                      >
                        <Tag className={styles.tag} icon={icon} color={color}>
                          {text}
                        </Tag>
                      </Popover>
                    ) : (
                      <Tag className={styles.tag} icon={icon} color={color}>
                        {text}
                      </Tag>
                    )}
                  </div>
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
      width: 150,
      align: 'center' as 'center',
      fixed: 'right' as 'right',
      render: (text: string, record: any) => {
        let currentStage = 0;
        for (let i = 0; i < orderedStage.length; i++) {
          if (
            !record[orderedStage[i]] &&
            i > 0 &&
            record[orderedStage[i - 1]]
          ) {
            currentStage = i;
            break;
          }
          if (i === 5 && record[orderedStage[i]]) {
            currentStage = 6;
          }
        }
        return (
          <div className={styles.action}>
            <Popover key={'edit'} content={'edit'}>
              <Link to={`/order/${record.id}`}>
                <img className={styles.logo} src={edit} alt="logo" />
              </Link>
            </Popover>
            <Popover key={'next'} content={'next'}>
              <Popconfirm
                title="Are you sure push it to next stage?"
                onConfirm={() =>
                  nextHandler(record.id, orderedStage[currentStage])
                }
              >
                <img className={styles.logo} src={next} alt="logo" />
              </Popconfirm>
            </Popover>

            <Popover key={'del'} content={'delete'}>
              <Popconfirm
                title="Are you sure to delete this record?"
                onConfirm={() => deleteHandler(record.id)}
              >
                <img className={styles.logo} src={del} alt="logo" />
              </Popconfirm>
            </Popover>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'orders/getOrders',
      payload: { current: urlState.current, pageSize: urlState.pageSize },
    });
  }, [urlState]);
  return (
    <div className={styles.container}>
      <Card className={styles.filterContainer}>
        <Filter setVisible={setVisible} />
      </Card>
      <Card>
        <Table
          bordered
          loading={loading || actionLoading}
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1500 }}
          sticky
          className={styles.table}
        />
        <Row justify="end" className={styles.pagination}>
          <Pagination
            onChange={onChangeHandler}
            showSizeChanger
            current={urlState.current ? parseInt(urlState.current) : 1}
            pageSize={urlState.pageSize ? parseInt(urlState.pageSize) : 5}
            pageSizeOptions={['5', '10', '15']}
            total={total}
          />
        </Row>
        <Create newVisible={visible} setNewVisible={setVisible} />
      </Card>
    </div>
  );
};

export default connect(
  ({ orders, loading }: { orders: OrderModelState; loading: Loading }) => ({
    orders: orders.orders,
    loading: loading.models.orders,
    total: orders.total,
  }),
)(React.memo(Order));
