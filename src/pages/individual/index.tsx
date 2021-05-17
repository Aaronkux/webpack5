import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Popover,
  Pagination,
  Row,
  Avatar,
  Popconfirm,
  Tag,
  Image,
  message,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
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
      width: 150,
    },
    gender: {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender: boolean, record: any) => {
        return <>{gender ? 'male' : 'female'}</>;
      },
    },
    DOB: {
      title: 'DOB',
      dataIndex: 'DOB',
      key: 'DOB',
      width: 120,
      render: (dob: string, record: any) => {
        return <>{moment(dob).zone(6).format('DD-MM-YYYY')}</>;
      },
    },
    salesman: {
      title: 'Salesman',
      dataIndex: 'salesman',
      key: 'salesman',
      width: 150,
      render: (salesman: IndividualClientInfo['salesman']) => salesman?.name,
    },
    email: {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
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
      width: 150,
    },
    employerName: {
      title: 'Employer Name',
      dataIndex: 'employerName',
      key: 'employerName',
      width: 150,
    },
    annualIncome: {
      title: 'Annual Income',
      dataIndex: 'annualIncome',
      key: 'annualIncome',
      width: 150,
    },
    sourceOfIncome: {
      title: 'Source Of Income',
      dataIndex: 'sourceOfIncome',
      key: 'sourceOfIncome',
      width: 150,
    },
    id1front: {
      title: 'Id1 Front',
      dataIndex: 'id1front',
      key: 'id1front',
      width: 150,
      render: (img: string) => <Image src={img} width='64px' height='64px' />,
    },
    id1back: {
      title: 'Id1 Back',
      dataIndex: 'id1back',
      key: 'id1back',
      width: 150,
      render: (img: string) => <Image src={img} width='64px' height='64px' />,
    },
    id2front: {
      title: 'Id2 Front',
      dataIndex: 'id2front',
      key: 'id2front',
      width: 150,
      render: (img: string) => <Image src={img} width='64px' height='64px' />,
    },
    id2back: {
      title: 'Id2 Back',
      dataIndex: 'id2back',
      key: 'id2back',
      width: 150,
      render: (img: string) => <Image src={img} width='64px' height='64px' />,
    },
    faceImage: {
      title: 'Face Image',
      dataIndex: 'faceImage',
      key: 'faceImage',
      width: 150,
      render: (img: string) => <Image src={img} width='64px' height='64px' />,
    },
    faceTest: {
      title: 'Face Test',
      dataIndex: 'faceTest',
      key: 'faceTest',
      width: 150,
      render: (img: string) => <Image src={img} width='64px' height='64px' />,
    },
    purpose: {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 150,
    },
    other: {
      title: 'Other',
      dataIndex: 'other',
      key: 'other',
      width: 150,
    },
    createdDate: {
      title: 'CreatedDate',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (dob: string) => {
        return <>{moment(dob).zone(6).format('DD-MM-YYYY')}</>;
      },
      width: 150,
    },
    unsubscribe: {
      title: 'Unsubscribe',
      dataIndex: 'unsubscribe',
      key: 'unsubscribe',
      width: 150,
      render: (unsubscribe: boolean) =>
        unsubscribe ? (
          <Tag
            className={styles.tag}
            icon={<CloseCircleOutlined />}
            color={'warning'}
          >
            unsubscribe
          </Tag>
        ) : (
          <Tag
            className={styles.tag}
            icon={<CheckCircleOutlined />}
            color={'success'}
          >
            following
          </Tag>
        ),
    },
    id1ExpireDate: {
      title: 'Id1 Expire Date',
      dataIndex: 'id1ExpireDate',
      key: 'id1ExpireDate',
      render: (dob: string) => {
        return <>{moment(dob).zone(6).format('DD-MM-YYYY')}</>;
      },
      width: 150,
    },
    id2ExpireDate: {
      title: 'Id2 Expire Date',
      dataIndex: 'id2ExpireDate',
      key: 'id2ExpireDate',
      render: (dob: string) => {
        return <>{moment(dob).zone(6).format('DD-MM-YYYY')}</>;
      },
      width: 150,
    },
    signature: {
      title: 'Signature',
      dataIndex: 'signature',
      key: 'signature',
      width: 150,
      render: (img: string) => <Image src={img} width='64px' height='64px' />,
    },
  };
  // let dynamicColumns: any = clientlistcolumns.map((value) => allColumns[value]);
  let dynamicColumns: any = [...Object.values(allColumns)];
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
    width: 150,
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
          sticky
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
