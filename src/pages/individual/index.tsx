import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Popover,
  Pagination,
  Row,
  Avatar,
  Popconfirm,
  message,
} from 'antd';
import type { PaginationProps } from 'antd';
import useURLParams from '@/hooks/useURLParams';
import { connect, useDispatch, request } from 'umi';
import type { ClientsModelState, Loading } from 'umi';
import moment from 'moment';
import type { IndividualClientInfo } from '@/services/clients';
import Filter from './components/Filter';
import { Link } from 'react-router-dom';
import styles from './index.less';
import del from '@/assets/del.svg';
import edit from '@/assets/edit.svg';

const clientlistcolumns = [
  'name',
  'gender',
  'email',
  'annualIncome',
  'address',
  'id1front',
  'id1back',
  'purpose',
  'other',
];

interface PropsType {
  individualClients: IndividualClientInfo[];
  total: number;
  loading: boolean;
}

const IndividualClients = ({
  individualClients,
  total,
  loading,
}: PropsType) => {
  const [urlState, setURL] = useURLParams();
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(false);
  const onChangeHandler: PaginationProps['onChange'] = (page, pageSize) => {
    setURL({ current: page.toString(), pageSize: pageSize?.toString() });
  };

  const allColumns: { [x: string]: any } = {
    name: {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    gender: {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: 0 | 1, record: any) => {
        return <>{gender === 1 ? 'male' : 'female'}</>;
      },
    },
    DOB: {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (dob: string, record: any) => {
        return <>{moment(dob).zone(6).format('DD-MM-YYYY')}</>;
      },
    },
    salesname: {
      title: 'Salesname',
      dataIndex: 'salesname',
      key: 'salesname',
    },
    email: {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    address: {
      title: 'address',
      dataIndex: 'address',
      key: 'address',
      width: 250,
      render: (_: string, record: IndividualClientInfo) => {
        return `${record.address} ${record.suburb} ${record.state} ${record.state} ${record.country}, ${record.occupation}`;
      },
    },
    occupation: {
      title: 'Occupation',
      dataIndex: 'occupation',
      key: 'occupation',
    },
    employerName: {
      title: 'Employer Name',
      dataIndex: 'employerName',
      key: 'employerName',
    },
    annualIncome: {
      title: 'Annual Income',
      dataIndex: 'annualIncome',
      key: 'annualIncome',
    },
    sourceOfIncome: {
      title: 'Source Of Income',
      dataIndex: 'sourceOfIncome',
      key: 'sourceOfIncome',
    },
    id1front: {
      title: 'Id1 Front',
      dataIndex: 'id1front',
      key: 'id1front',
      render: (img: string) => <Avatar src={img} size={48} />,
    },
    id1back: {
      title: 'Id1 Back',
      dataIndex: 'id1back',
      key: 'id1back',
      render: (img: string) => <Avatar src={img} size={48} />,
    },
    id2front: {
      title: 'Id2 Front',
      dataIndex: 'id2front',
      key: 'id2front',
      render: (img: string) => <Avatar src={img} size={48} />,
    },
    id2back: {
      title: 'Id2 Back',
      dataIndex: 'id2back',
      key: 'id2back',
      render: (img: string) => <Avatar src={img} size={48} />,
    },
    faceImage: {
      title: 'Face Image',
      dataIndex: 'faceImage',
      key: 'faceImage',
      render: (img: string) => <Avatar src={img} size={48} />,
    },
    faceTest: {
      title: 'Face Test',
      dataIndex: 'faceTest',
      key: 'faceTest',
      render: (img: string) => <Avatar src={img} size={48} />,
    },
    purpose: {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    other: {
      title: 'Other',
      dataIndex: 'other',
      key: 'other',
    },
    compliance: {
      title: 'Compliance',
      dataIndex: 'compliance',
      key: 'compliance',
    },
    unsubscribe: {
      title: 'Unsubscribe',
      dataIndex: 'unsubscribe',
      key: 'unsubscribe',
    },
    id1ExpireDate: {
      title: 'Id1 Expire Date',
      dataIndex: 'id1ExpireDate',
      key: 'id1ExpireDate',
    },
    signature: {
      title: 'Signature',
      dataIndex: 'signature',
      key: 'signature',
      render: (img: string) => <Avatar shape="square" src={img} size={48} />,
    },
  };
  let dynamicColumns: any = clientlistcolumns.map((value) => allColumns[value]);
  const headColumns = {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    fixed: 'left' as 'left',
    width: 60,
    render: (stage: any, record: any, index: number) => index + 1,
  };
  const operators = {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right' as 'right',
    render: (text: string, record: any) => {
      return (
        <div className={styles.action}>
          <Link to={`/clients/individual/${record.id}`}>
            <Popover content={'edit'}>
              <img src={edit} alt="logo" />
            </Popover>
          </Link>
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
  };

  dynamicColumns = [headColumns, ...dynamicColumns, operators];
  const deleteHandler = async (clientId: string) => {
    setActionLoading(true);
    const res = await request(`/api/getIndividualClients/${clientId}`, {
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
          loading={loading || actionLoading}
          columns={dynamicColumns}
          dataSource={individualClients}
          rowKey={'id'}
          pagination={false}
          scroll={{ x: 1500 }}
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
)(React.memo(IndividualClients));
