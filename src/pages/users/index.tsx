import React, { useState, useEffect } from 'react';
import { Link, useDispatch, connect, request } from 'umi';
import { Card, Table, Row, Pagination, message } from 'antd';
import type { PaginationProps } from 'antd';
import type { UsersModelState, Loading } from 'umi';
import type { UserInfo } from '@/services/users';
import useURLParams from '@/hooks/useURLParams';
import Filter from './Filter';
import styles from './index.less';

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
  ];

  const deleteHandler = async (orderId: string) => {
    setActionLoading(true);
    const res = await request(`/api/order/${orderId}`, {
      method: 'delete',
    });
    if (res.success) {
      message.success('Success');
      dispatch({
        type: 'users/getUsers',
        payload: { current: urlState.current, pageSize: urlState.pageSize },
      });
    } else {
      message.error(res.errorMessage);
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
          // columns={columns}
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
        {/* <Create newVisible={visible} setNewVisible={setVisible} /> */}
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
