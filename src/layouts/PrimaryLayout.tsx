import React, { useState } from 'react';
import { Layout, Drawer, Button, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { useResponsive } from '@umijs/hooks';
import styles from './PrimaryLayout.less';
import logo from '@/assets/gplogo.png';
import store from 'store';
import { route2List } from '@/utils';
import { routes } from '../../config/route';
import { IBestAFSRoute } from '@umijs/plugin-layout';

const { SubMenu } = Menu;
const { Sider, Header, Content, Footer } = Layout;

const generateMenus = (data:IBestAFSRoute[]) => {
  return data.map(item => {
    if (item.routes) {
      return (
        <SubMenu
          key={item.name}
          title={
            <>
              {/* {item.icon} */}
              <span>{item.name}</span>
            </>
          }
        >
          {generateMenus(item.routes)}
        </SubMenu>
      )
    }
    return (
      <Menu.Item key={item.name}>
        <NavLink to={item.path || '#'}>
          {/* {item.icon} */}
          <span>{item.name}</span>
        </NavLink>
      </Menu.Item>
    )
  })
}

interface PropsType {
  children: React.ReactNode;
}


export default function PrimaryLayout({ children }: PropsType) {
  const [collapsed, setCollapsed] = useState(false);
  const responsive = useResponsive();
  const drawerSider = !responsive['md'];
  const user = store.get('user');
  const routeList = route2List(routes[0].routes as IBestAFSRoute[], user);
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
            style={{ paddingBottom: '40px', height: '100%' }}
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
                <img className={styles.logoImg} alt="logo" src={logo} />
                {!collapsed && <h1 className={styles.logoText}>Global Pay</h1>}
              </div>
            </div>
          </Sider>
        </Drawer>
      ) : (
        <Sider
          style={{ backgroundColor: '#fefefe' }}
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
          <div className={styles.menuContainer}>
            <Menu className={styles.navMenu} mode="inline">
              {generateMenus(routeList)}
            </Menu>
          </div>
        </Sider>
      )}
      <Layout>
        <Header style={{ backgroundColor: '#fff', height: '82px' }}>
          <Button type="primary" onClick={() => setCollapsed(!collapsed)}>
            Collapsed
          </Button>
        </Header>
        <Content style={{ backgroundColor: '#f5f5f5' }}>{children}</Content>
        <Footer style={{ backgroundColor: '#fff' }}>Footer</Footer>
      </Layout>
    </Layout>
  );
}
