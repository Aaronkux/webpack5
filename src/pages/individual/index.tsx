import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Popover,
  Pagination,
  Row,
  Popconfirm,
  Tag,
  Image,
  message,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import { useRequest } from 'umi';
import moment from 'moment';
import AuthImg from '@/components/AuthImg';
import useURLParams from '@/hooks/useURLParams';
import type { IndividualClientInfo } from '@/services/clients';
import {
  getIndividualClients,
  deleteIndividualClient,
} from '@/services/clients';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import Filter from './components/Filter';
import Create from './Create';
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

const IndividualClients = () => {
  const [visible, setVisible] = useState(false);
  const [urlState, setURL] = useURLParams();
  const { data, loading, run } = useRequest(getIndividualClients, {
    manual: true,
  });
  const { loading: deleteLoading, run: deleteClient } = useRequest(
    deleteIndividualClient,
    {
      manual: true,
      onSuccess: () => {
        message.success('Delete Successfully!');
        fetchIndividualClients();
      },
    },
  );
  const deleteHandler = (clientId: string) => {
    deleteClient(clientId);
  };

  const fetchIndividualClients = () => {
    const { current = 1, pageSize = 5 } = urlState;
    run(current, pageSize);
  };
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
      width: 90,
      render: (gender: boolean, record: any) => {
        return (
          <>
            {!gender ? (
              <ManOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
            ) : (
              <WomanOutlined style={{ color: 'pink', fontSize: '24px' }} />
            )}
          </>
        );
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
      render: (img: string) => img && <AuthImg path={img} size={64} preview />,
    },
    id1back: {
      title: 'Id1 Back',
      dataIndex: 'id1back',
      key: 'id1back',
      width: 150,
      render: (img: string) => img && <AuthImg path={img} size={64} preview />,
    },
    id2front: {
      title: 'Id2 Front',
      dataIndex: 'id2front',
      key: 'id2front',
      width: 150,
      render: (img: string) => img && <AuthImg path={img} size={64} preview />,
    },
    id2back: {
      title: 'Id2 Back',
      dataIndex: 'id2back',
      key: 'id2back',
      width: 150,
      render: (img: string) => img && <AuthImg path={img} size={64} preview />,
    },
    faceImage: {
      title: 'Face Image',
      dataIndex: 'faceImage',
      key: 'faceImage',
      width: 150,
      render: (img: string) => img && <AuthImg path={img} size={64} preview />,
    },
    faceTest: {
      title: 'Face Test',
      dataIndex: 'faceTest',
      key: 'faceTest',
      width: 150,
      render: (img: string) => img && <AuthImg path={img} size={64} preview />,
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
      render: (date: string) => {
        return date && moment(date).zone(6).format('DD-MM-YYYY');
      },
      width: 150,
    },
    id2ExpireDate: {
      title: 'Id2 Expire Date',
      dataIndex: 'id2ExpireDate',
      key: 'id2ExpireDate',
      render: (date: string) => {
        return date && moment(date).zone(6).format('DD-MM-YYYY');
      },
      width: 150,
    },
    signature: {
      title: 'Signature',
      dataIndex: 'signature',
      key: 'signature',
      width: 150,
      render: (img: string) => img && <AuthImg path={img} size={64} preview />,
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

  useEffect(() => {
    fetchIndividualClients();
  }, [urlState]);

  return (
    <>
      <Card className={styles.filterContainer}>
        <Filter setVisible={setVisible} />
      </Card>
      <Card>
        <Table
          className={styles.table}
          bordered
          loading={loading || deleteLoading}
          columns={dynamicColumns}
          dataSource={data?.data}
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
            total={data?.total}
          />
        </Row>
        <Create
          fetchIndividualClients={fetchIndividualClients}
          newVisible={visible}
          setNewVisible={setVisible}
        />
      </Card>
    </>
  );
};

export default React.memo(IndividualClients);
