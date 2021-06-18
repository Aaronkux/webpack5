import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Popover,
  Pagination,
  Row,
  Tag,
  Popconfirm,
  Image,
  message,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import useURLParams from '@/hooks/useURLParams';
import { useRequest } from 'umi';
import moment from 'moment';
import { getCompanyClients, deleteCompanyClient } from '@/services/clients';
import type { CompanyClientInfo } from '@/services/clients';
import Create from './Create';
import Filter from './components/Filter';
import { Link } from 'react-router-dom';
import styles from './index.less';
import del from '@/assets/del.svg';
import edit from '@/assets/edit.svg';

const clientlistcolumns = [
  'name',
  'ABN_ACN_ARBN',
  'companyType',
  'salesman',
  'companyContactNumber',
  'email',
  'registeredBusinessAddress',
  'principleBusinessAddress',
  'accountHolderName',
  'accountHolderPosition',
];

interface PropsType {
  companyClients: CompanyClientInfo[];
  total: number;
  loading: boolean;
}

const CompanyClients = () => {
  const [visible, setVisible] = useState(false);
  const [urlState, setURL] = useURLParams();
  const { data, loading, run } = useRequest(getCompanyClients, {
    manual: true,
  });
  const { loading: deleteLoading, run: deleteClient } = useRequest(
    deleteCompanyClient,
    {
      manual: true,
      onSuccess: () => {
        message.success('Delete Successfully!');
        fetchCompanyClients();
      },
    },
  );
  const deleteHandler = (clientId: string) => {
    deleteClient(clientId);
  };

  const fetchCompanyClients = () => {
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
    ABN_ACN_ARBN: {
      title: 'ABN_ACN_ARBN',
      dataIndex: 'ABN_ACN_ARBN',
      key: 'ABN_ACN_ARBN',
      width: 150,
    },
    companyType: {
      title: 'Company Type',
      dataIndex: 'companyType',
      key: 'companyType',
      width: 150,
    },
    salesman: {
      title: 'Salesman',
      dataIndex: 'salesman',
      key: 'salesman',
      width: 150,
      render: (salesman: CompanyClientInfo['salesman']) => salesman?.name,
    },
    registeredBusinessAddress: {
      title: 'Registered Business Address',
      dataIndex: 'registeredBusinessAddress',
      key: 'registeredBusinessAddress',
      width: 250,
    },
    principleBusinessAddress: {
      title: 'Principle Business Address',
      dataIndex: 'principleBusinessAddress',
      key: 'principleBusinessAddress',
      width: 250,
    },
    companyContactNumber: {
      title: 'Company Contact Number',
      dataIndex: 'companyContactNumber',
      key: 'companyContactNumber',
      width: 150,
    },
    email: {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    legalPerson1front: {
      title: 'Legal Person1 Front',
      dataIndex: 'legalPerson1front',
      key: 'legalPerson1front',
      width: 150,
      render: (img: string) => <Image src={img} width="64px" height="64px" />,
    },
    legalPerson1back: {
      title: 'Legal Person1 Back',
      dataIndex: 'legalPerson1back',
      key: 'legalPerson1back',
      width: 150,
      render: (img: string) => <Image src={img} width="64px" height="64px" />,
    },
    legalPerson2front: {
      title: 'Legal Person2 Front',
      dataIndex: 'legalPerson2front',
      key: 'legalPerson2front',
      width: 150,
      render: (img: string) => <Image src={img} width="64px" height="64px" />,
    },
    legalPersion2back: {
      title: 'Legal Persion2 Back',
      dataIndex: 'legalPersion2back',
      key: 'legalPersion2back',
      width: 150,
      render: (img: string) => <Image src={img} width="64px" height="64px" />,
    },
    companyExtract: {
      title: 'Company Extract',
      dataIndex: 'companyExtract',
      key: 'companyExtract',
      width: 150,
      render: (img: string) => <Image src={img} width="64px" height="64px" />,
    },
    accountHolderName: {
      title: 'AccountHolder Name',
      dataIndex: 'accountHolderName',
      key: 'accountHolderName',
      width: 150,
    },
    accountHolderPosition: {
      title: 'AccountHolder Position',
      dataIndex: 'accountHolderPosition',
      key: 'accountHolderPosition',
      width: 150,
    },
    accountHolderDOB: {
      title: 'AccountHolder DOB',
      dataIndex: 'accountHolderDOB',
      key: 'accountHolderDOB',
      render: (dob: string, record: any) => {
        return <>{dob && moment(dob).zone(6).format('DD-MM-YYYY')}</>;
      },
      width: 150,
    },
    accountHolderContactNumber: {
      title: 'AccountHolder ContactNumber',
      dataIndex: 'accountHolderContactNumber',
      key: 'accountHolderContactNumber',
      width: 150,
    },
    accountHolderEmail: {
      title: 'AccountHolder Email',
      dataIndex: 'accountHolderEmail',
      key: 'accountHolderEmail',
      width: 150,
    },
    accountHolderResidentialAddress: {
      title: 'AccountHolder Residential Address',
      dataIndex: 'accountHolderResidentialAddress',
      key: 'accountHolderResidentialAddress',
      width: 150,
    },
    purpose: {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 150,
    },
    signature: {
      title: 'Signature',
      dataIndex: 'signature',
      key: 'signature',
      width: 150,
      render: (img: string) => <Image src={img} width="64px" height="64px" />,
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
    person1ExpireDate: {
      title: 'Person1 Expire Date',
      dataIndex: 'person1ExpireDate',
      key: 'person1ExpireDate',
      render: (dob: string) => {
        return <>{dob && moment(dob).zone(6).format('DD-MM-YYYY')}</>;
      },
      width: 150,
    },
    person2ExpireDate: {
      title: 'Person2 Expire Date',
      dataIndex: 'person2ExpireDate',
      key: 'person2ExpireDate',
      render: (dob: string) => {
        return <>{dob && moment(dob).zone(6).format('DD-MM-YYYY')}</>;
      },
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
          <Link to={`/clients/company/${record.id}`}>
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
    fetchCompanyClients();
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
          fetchCompanyClients={fetchCompanyClients}
          newVisible={visible}
          setNewVisible={setVisible}
        />
      </Card>
    </>
  );
};

export default React.memo(CompanyClients);
