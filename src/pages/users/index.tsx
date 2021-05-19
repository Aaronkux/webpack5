import React, { useState, useEffect } from 'react';
import { Link, useDispatch, connect, request } from 'umi';
import {
  Card,
  Table,
  Row,
  Pagination,
  message,
  Avatar,
  Popover,
  Popconfirm,
  Tag,
} from 'antd';
import type { PaginationProps } from 'antd';
import type { UsersModelState, Loading } from 'umi';
import moment from 'moment';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { UserInfo } from '@/services/users';
import useURLParams from '@/hooks/useURLParams';
import Filter from './Filter';
import Create from './Create';
import styles from './index.less';
import edit from '@/assets/edit.svg';
import del from '@/assets/del.svg';

interface PropsType {
  users: UserInfo[];
  total: number;
  loading: boolean;
}
const Users = ({ users, total, loading }: PropsType) => {
  const dispatch = useDispatch();
  const [urlState, setURL] = useURLParams();
  const [visible, setVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const onChangeHandler: PaginationProps['onChange'] = (page, pageSize) => {
    setURL({ current: page.toString(), pageSize: pageSize?.toString() });
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
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      width: 100,
      render: (img: string) => <Avatar src={img} size={48} />,
    },
    {
      title: 'IsActive',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'IsAdmin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color="success"
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Sales Permission',
      dataIndex: 'salesPermission',
      key: 'salesPermission',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Client Permission',
      dataIndex: 'clientPermission',
      key: 'clientPermission',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Order Permission',
      dataIndex: 'orderPermission',
      key: 'orderPermission',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Email Permission',
      dataIndex: 'emailPermission',
      key: 'emailPermission',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Check Compliance',
      dataIndex: 'checkCompliance',
      key: 'checkCompliance',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Check FundNotified',
      dataIndex: 'checkFundNotified',
      key: 'checkFundNotified',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Check FundReceived',
      dataIndex: 'checkFundReceived',
      key: 'checkFundReceived',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Check ClientComfirmed',
      dataIndex: 'checkClientComfirmed',
      key: 'checkClientComfirmed',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Check FundPaid',
      dataIndex: 'checkFundPaid',
      key: 'checkFundPaid',
      width: 130,
      render: (isChecked: boolean) =>
        isChecked ? (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            checked
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unchecked
          </Tag>
        ),
    },
    {
      title: 'Create Date',
      dataIndex: 'create_date',
      key: 'create_date',
      width: 150,
      render: (date: string) =>
        moment(date).zone(6).format('DD-MMM-YYYY h:mm:ss'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      align: 'center' as 'center',
      fixed: 'right' as 'right',
      render: (text: string, record: any) => {
        return (
          <div className={styles.action}>
            <Popover key={'edit'} content={'edit'}>
              <Link to={`/users/${record.id}`}>
                <img className={styles.logo} src={edit} alt="logo" />
              </Link>
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

  const deleteHandler = async (orderId: string) => {
    setActionLoading(true);
    const res = await request(`/api/users/${orderId}`, {
      method: 'delete',
    });
    if (res.success) {
      message.success('Success');
      dispatch({
        type: 'users/getUsers',
        payload: { current: urlState.current, pageSize: urlState.pageSize },
      });
    } else {
      message.warning(res.errorMessage);
    }
    setActionLoading(false);
  };

  useEffect(() => {
    dispatch({
      type: 'users/getUsers',
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
          dataSource={users}
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
        <Create urlState={urlState} newVisible={visible} setNewVisible={setVisible} />
      </Card>
    </div>
  );
};

export default connect(
  ({ users, loading }: { users: UsersModelState; loading: Loading }) => ({
    users: users.users,
    loading: loading.models.users,
    total: users.total,
  }),
)(React.memo(Users));
