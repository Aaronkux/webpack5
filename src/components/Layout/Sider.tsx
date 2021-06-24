import React, { useMemo } from 'react';
import { Layout, Drawer, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import styles from './Sider.less';
import { interopRequireDefault } from '@/utils';
import { IBestAFSRoute } from '@umijs/plugin-layout';
import { route2List } from '@/utils';
import { useResponsive } from '@umijs/hooks';
import logo from '@/assets/gplogo.png';
import { routes } from '../../../config/route';
import { useLocation } from 'react-router-dom';
import store from 'store';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface PropsType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  userData: any;
}

const antdIconModule = require('@ant-design/icons');
const iconMap = interopRequireDefault(antdIconModule);

const generateMenus = (data: IBestAFSRoute[]) => {
  return data.map((item) => {
    if (item.routes) {
      return (
        <SubMenu
          key={item.path}
          title={
            <>
              {React.createElement(iconMap[item.icon], null, null)}
              <span>{item.name}</span>
            </>
          }
        >
          {generateMenus(item.routes)}
        </SubMenu>
      );
    }
    return (
      <Menu.Item key={item.path}>
        <NavLink to={item.path || '#'}>
          {React.createElement(iconMap[item.icon], null, null)}
          <span>{item.name}</span>
        </NavLink>
      </Menu.Item>
    );
  });
};

interface MenuPropsType {
  collapsed: boolean;
  routeMap: Map<string, IBestAFSRoute>;
  routeList: Map<string, IBestAFSRoute>;
  canCollapsed: boolean;
  defaultSelectedKeys: string[];
}

const MenuComponent = ({
  collapsed,
  routeMap,
  routeList,
  canCollapsed,
  defaultSelectedKeys,
}: MenuPropsType) => {
  const defaultOpenKeys = defaultSelectedKeys[0]
    ? routeList.get(defaultSelectedKeys[0])?.parentPath ?? ['']
    : [''];
  return (
    <Sider
      collapsed={canCollapsed}
      trigger={null}
      collapsible
      width="250"
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
        <Menu
          defaultOpenKeys={[defaultOpenKeys]}
          defaultSelectedKeys={defaultSelectedKeys}
          className={styles.navMenu}
          mode="inline"
        >
          {generateMenus([...routeMap.values()])}
        </Menu>
      </div>
    </Sider>
  );
};

export default function MySider({
  collapsed,
  setCollapsed,
  userData,
}: PropsType) {
  const responsive = useResponsive();
  const location = useLocation();
  const drawerSider = !responsive['md'];
  const user = userData || store.get('user');
  const [routeMap, routeList] = useMemo(() => route2List(routes, user), [user]);
  // prevent default pathname change
  const defaultPathname = useMemo(() => {
    let path = location.pathname;
    const isDetailPathname = /\/\d+$/.test(path);
    if (isDetailPathname) return path.replace(/\/\d+$/, '');
    return location.pathname;
  }, []);

  return (
    <>
      {drawerSider ? (
        <Drawer
          visible={!collapsed}
          closable={false}
          onClose={() => setCollapsed(!collapsed)}
          placement="left"
          width="280"
          bodyStyle={{ padding: '0', overflow: 'hidden' }}
        >
          <MenuComponent
            canCollapsed={false}
            collapsed={collapsed}
            routeMap={routeMap}
            routeList={routeList}
            defaultSelectedKeys={[defaultPathname]}
          />
        </Drawer>
      ) : (
        <MenuComponent
          canCollapsed={collapsed}
          collapsed={collapsed}
          routeMap={routeMap}
          routeList={routeList}
          defaultSelectedKeys={[defaultPathname]}
        />
      )}
    </>
  );
}
