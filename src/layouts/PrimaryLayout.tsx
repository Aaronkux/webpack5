import React, { useState } from 'react';
import { Layout, Button, Breadcrumb } from 'antd';
import { Sider } from '@/components/Layout';

import { route2Bread } from '@/utils';
import { routes } from '../../config/route';
import store from 'store';
import { useLocation, Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

interface PropsType {
  children: React.ReactNode;
}

export default function PrimaryLayout({ children }: PropsType) {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const user = store.get('user');
  const breadcrumbNameMap = route2Bread(routes, user);
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(
    extraBreadcrumbItems.filter((i) => breadcrumbNameMap[i.key as string]),
  );
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Header style={{ backgroundColor: '#fff', height: '82px' }}>
          <Button type="primary" onClick={() => setCollapsed(!collapsed)}>
            Collapsed
          </Button>
        </Header>
        <Content style={{ backgroundColor: '#f5f5f5', padding: '15px' }}>
          <Breadcrumb>{breadcrumbItems}</Breadcrumb>
          {children}
        </Content>
        <Footer style={{ backgroundColor: '#fff' }}>Footer</Footer>
      </Layout>
    </Layout>
  );
}
