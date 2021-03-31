import React from 'react';
import { FrownOutlined } from '@ant-design/icons';
import { Card, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const Error = () => {
  const history = useHistory();
  return (
    <Card>
      <div>
        <FrownOutlined />
        <h1>404 Not Found</h1>
        <Button type="primary" onClick={() => history.replace('/')}>
          Back to Index Page
        </Button>
      </div>
    </Card>
  );
};

export default Error;
