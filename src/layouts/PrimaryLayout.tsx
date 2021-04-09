import React, { useState } from 'react';
import { Layout, Button, Breadcrumb } from 'antd';
import { Sider, Bread } from '@/components/Layout';

const { Header, Content, Footer } = Layout;

interface PropsType {
  children: React.ReactNode;
}

export default function PrimaryLayout({ children }: PropsType) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Header style={{ backgroundColor: '#fff', height: '60px' }}>
          <Button type="primary" onClick={() => setCollapsed(!collapsed)}>
            Collapsed
          </Button>
        </Header>
        <Content style={{ backgroundColor: '#f5f5f5', padding: '15px' }}>
          <Bread />
          {children}
        </Content>
        <Footer style={{ backgroundColor: '#fff' }}>Footer</Footer>
      </Layout>
    </Layout>
  );
}
