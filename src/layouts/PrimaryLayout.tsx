import React, { useEffect, useState } from 'react';
import { Layout, Drawer, Button } from 'antd';
import { useResponsive } from '@umijs/hooks';
import styles from './PrimaryLayout.less';
import logo from '@/assets/gplogo.png';

interface PropsType {
  children: React.ReactNode;
}

const { Sider, Header, Content, Footer } = Layout;

export default function PrimaryLayout({ children }: PropsType) {
  const [collapsed, setCollapsed] = useState(false);
  const responsive = useResponsive();
  const drawerSider = !responsive['md'];
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {drawerSider ? (
        <Drawer
          visible={!collapsed}
          closable={false}
          onClose={() => setCollapsed(!collapsed)}
          placement="left"
          width="280"
          bodyStyle={{ padding: '0' }}
        >
          <Sider
            style={{ paddingBottom: '40px' }}
            collapsed={false}
            trigger={null}
            collapsible
            width="280"
            theme="light"
            breakpoint="lg"
            className={styles.sider}
          >
            <div className={styles.brand}>
              <div className={styles.logo}>
                <img alt="logo" src={logo} />
                {!collapsed && <h1>Global Pay</h1>}
              </div>
            </div>
          </Sider>
        </Drawer>
      ) : (
        <Sider
          style={{ paddingBottom: '40px' }}
          collapsed={collapsed}
          trigger={null}
          collapsible
          width="280"
          theme="light"
          breakpoint="lg"
          className={styles.sider}
        >
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img className={styles.logoImg} alt="logo" src={logo} />
              {!collapsed && <h1 className={styles.logoText}>Global Pay</h1>}
            </div>
          </div>
        </Sider>
      )}
      <Layout>
        <Header style={{ backgroundColor: 'green', height: '82px' }}>
          <Button type="primary" onClick={() => setCollapsed(!collapsed)}>
            Collapsed
          </Button>
        </Header>
        <Content>{children}</Content>
        <Footer style={{ backgroundColor: 'pink' }}>Footer</Footer>
      </Layout>
    </Layout>
  );
}
