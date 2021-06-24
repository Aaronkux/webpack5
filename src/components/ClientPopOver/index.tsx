import React from 'react';
import { Popover, Card, Button } from 'antd';
import type {
  CompanyClientInfo,
  IndividualClientInfo,
} from '@/services/clients';
import styles from './index.less';

type ClientsType = CompanyClientInfo & IndividualClientInfo;

interface PropsType {
  data: ClientsType;
  [props: string]: any;
}

const ClientPopOver: React.FC<PropsType> = ({ data, ...rest }) => {
  const content = (
    <Card>
      <p>Registration Id: {data?.registrationId}</p>
      <p>Salesname: {data?.salesman?.name}</p>
    </Card>
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <span>{data.name}</span>
      {/* <Popover content={content} trigger="click">
        <Button>Detail</Button>
      </Popover> */}
    </div>
  );
};

export default ClientPopOver;
