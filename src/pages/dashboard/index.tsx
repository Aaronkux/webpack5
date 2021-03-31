import React from 'react';
import { Button } from 'antd';
import store from 'store';
import { useHistory } from 'react-router-dom';

export default function DashBoard() {
  const history = useHistory();
  return (
    <Button
      onClick={() => {
        store.remove('user');
        history.replace('/login');
      }}
    >
      logout
    </Button>
  );
}
