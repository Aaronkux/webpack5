import React from 'react';
import { Card, Table, Popover } from 'antd';
import Filter from './components/Filter';
import { Link } from 'react-router-dom';

import edit from '@/assets/edit.svg';

const clientlistcolumns = [
  'name',
  'gender',
  'email',
  'annualIncome',
  'country',
];

const data = [
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
  {
    name: 'test1',
    gender: 'male',
    email: 'test@test.com',
    annualIncome: '1010',
    country: 'china',
  },
];

const dynamicColumns = clientlistcolumns.map((value) => {
  const upperCase = value.charAt(0).toUpperCase() + value.slice(1);
  return {
    title: upperCase,
    dataIndex: value,
    key: value,
  };
});
const operators = {
  title: 'Action',
  dataIndex: 'action',
  key: 'action',
  render: (text: string, record: any) => {
    return (
      <Link to="#">
        <Popover content={'edit'}>
          <img src={edit} alt="logo" />
        </Popover>
      </Link>
    );
  },
};
dynamicColumns.push(operators);

export default function Clients() {
  return (
    <>
      <Card>
        <Filter />
      </Card>
      <Card>
        <Table
          columns={dynamicColumns}
          dataSource={data}
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 10,
            showSizeChanger: true,
            onShowSizeChange: (current, size) =>
              console.log('requestIndividualData', current, size),
            onChange: (page, pageSize) =>
              console.log('requestIndividualData', page, pageSize),
          }}
        />
      </Card>
    </>
  );
}
