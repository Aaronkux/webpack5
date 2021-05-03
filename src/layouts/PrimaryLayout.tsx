import React, { useState } from 'react';
import { MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Avatar } from 'antd';
import { Sider, Bread, HeaderRight } from '@/components/Layout';
import styles from './PrimaryLayout.less';

const { Header, Content, Footer } = Layout;

interface PropsType {
  children: React.ReactNode;
}

export default function PrimaryLayout({ children }: PropsType) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className={styles.container}>
      <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerContainer}>
            <MenuFoldOutlined
              className={styles.menuFold}
              onClick={() => setCollapsed(!collapsed)}
            />
            <HeaderRight />
          </div>
        </Header>
        <Content className={styles.content}>
          <Bread />
          {children}
        </Content>
        <Footer className={styles.footer}>Global Pay Admin ©2021 Aaron</Footer>
      </Layout>
    </Layout>
  );
}
