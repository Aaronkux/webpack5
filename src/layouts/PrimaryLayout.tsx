import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined } from '@ant-design/icons';
import { useRequest } from '@/.umi/plugin-request/request';
import { Layout, Avatar } from 'antd';
import store from 'store';
import { Sider, Bread, HeaderRight } from '@/components/Layout';
import styles from './PrimaryLayout.less';
import { getUserDetail } from '@/services/users';

const { Header, Content, Footer } = Layout;

interface PropsType {
  children: React.ReactNode;
}

export default function PrimaryLayout({ children }: PropsType) {
  const [collapsed, setCollapsed] = useState(false);
  const [dynamicUser, setDynamicUser] = useState<{}>()
  const { data: userData, run } = useRequest(getUserDetail, {
    manual: true,
    onSuccess: (res) => {
      let access: string[] = [];
      const {
        id,
        name,
        username,
        photo,
        isAdmin,
        salesPermission,
        clientPermission,
        orderPermission,
        emailPermission,
      } = res!;
      if (salesPermission) {
        access.push('salesPermission');
      }
      if (clientPermission) {
        access.push('clientPermission');
      }
      if (orderPermission) {
        access.push('orderPermission');
      }
      if (emailPermission) {
        access.push('emailPermission');
      }
      if (isAdmin) {
        access.push('isAdmin');
      }
      store.set('user', { id, name, username, access, photo });
      setDynamicUser({ id, name, username, access, photo })
    },
  });
  useEffect(() => {
    const user = store.get('user');
    run(user.id);
  }, []);
  return (
    <Layout className={styles.container}>
      <Sider userData={dynamicUser} collapsed={collapsed} setCollapsed={setCollapsed} />
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
        <Footer className={styles.footer}>Global Pay Admin ©2021</Footer>
      </Layout>
    </Layout>
  );
}
