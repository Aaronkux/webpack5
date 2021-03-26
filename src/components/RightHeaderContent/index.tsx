import React from 'react';
import { Button } from 'antd';

export default function RightHeaderContent() {
  return (
    <div>
      <Button type='primary' style={{marginRight: '20px', borderRadius: '5%'}}>Register</Button>
      <Button type='primary' style={{marginRight: '20px', borderRadius: '5%'}}>Log in</Button>
    </div>
  );
}
