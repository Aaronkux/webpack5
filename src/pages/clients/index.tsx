import React from 'react';
import { Card, Table } from 'antd';
import Filter from './components/Filter';

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

const columns = clientlistcolumns.map((value) => {
  const upperCase = value.charAt(0).toUpperCase() + value.slice(1);
  return {
    title: upperCase,
    dataIndex: value,
    key: value,
  };
});

export default function Clients() {
  return (
    <>
      <Card>
        <Filter />
      </Card>
      <Card>
        <Table
          columns={columns}
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
