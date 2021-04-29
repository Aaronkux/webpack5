import React, { useEffect } from 'react';
import { Card, Table, Popover, Pagination, Row } from 'antd';
import type { PaginationProps } from 'antd';
import useURLParams from '@/hooks/useURLParams';
import { connect, useDispatch } from 'umi';
import type { ClientsModelState, Loading } from 'umi';
import type { IndividualClientInfo } from '@/services/clients';
import Filter from './components/Filter';
import { Link } from 'react-router-dom';
import styles from './index.less';

import edit from '@/assets/edit.svg';

const clientlistcolumns = [
  'name',
  'gender',
  'email',
  'annualIncome',
  'country',
];

const dynamicColumns = clientlistcolumns.map((value) => {
  const upperCase = value.charAt(0).toUpperCase() + value.slice(1);
  return {
    title: upperCase,
    dataIndex: value,
    key: value,
    render: (text: string, record: any) => {
      if (value === 'gender') {
        return <>{parseInt(text) === 1 ? 'male' : 'female'}</>;
      }
      return <>{text}</>;
    },
  };
});
const operators = {
  title: 'Action',
  dataIndex: 'action',
  key: 'action',
  render: (text: string, record: any) => {
    return (
      <Link to={`/clients/individual/${record.id}`}>
        <Popover content={'edit'}>
          <img src={edit} alt="logo" />
        </Popover>
      </Link>
    );
  },
};
dynamicColumns.push(operators);

interface PropsType {
  individualClients: IndividualClientInfo[];
  total: number;
  loading: boolean;
}

const Clients = ({ individualClients, total, loading }: PropsType) => {
  const [urlState, setURL] = useURLParams();
  const dispatch = useDispatch();
  const onChangeHandler: PaginationProps['onChange'] = (page, pageSize) => {
    setURL({ current: page.toString(), pageSize: pageSize?.toString() });
  };

  useEffect(() => {
    dispatch({
      type: 'clients/getIndividualClients',
      payload: { current: urlState.current, pageSize: urlState.pageSize },
    });
  }, [urlState]);

  return (
    <>
      <Card className={styles.filterContainer}>
        <Filter />
      </Card>
      <Card>
        <Table
          className={styles.table}
          bordered
          loading={loading}
          columns={dynamicColumns}
          dataSource={individualClients}
          rowKey={'id'}
          pagination={false}
        />
        <Row justify="end" className={styles.pagination}>
          <Pagination
            onChange={onChangeHandler}
            showSizeChanger
            current={urlState.current ? parseInt(urlState.current) : 1}
            pageSize={urlState.pageSize ? parseInt(urlState.pageSize) : 10}
            pageSizeOptions={['10', '15', '20']}
            total={total}
          />
        </Row>
      </Card>
    </>
  );
};

export default connect(
  ({ clients, loading }: { clients: ClientsModelState; loading: Loading }) => ({
    individualClients: clients.individualClients.clients,
    total: clients.individualClients.total,
    loading: loading.models.clients,
  }),
)(React.memo(Clients));
