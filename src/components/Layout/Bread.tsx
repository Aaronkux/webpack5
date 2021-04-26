import React from 'react';
import { route2Bread } from '@/utils';
import { Breadcrumb } from 'antd';
import { routes } from '../../../config/route';
import store from 'store';
import { useLocation, Link } from 'react-router-dom';
import styles from './Bread.less';

export default function Bread() {
  const location = useLocation();
  const user = store.get('user');
  const breadcrumbNameMap = route2Bread(routes, user);
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const isDetailPathname = /\/\d+$/.test(location.pathname);
  const extraBreadcrumbItems = pathSnippets.map((path, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    if (isDetailPathname && index === pathSnippets.length - 1) {
      let routePath = url.replace(/\d+$/, ':id');
      return (
        <Breadcrumb.Item key={routePath}>
          <Link to={url}>{path}</Link>
        </Breadcrumb.Item>
      );
    }
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
    <Breadcrumb className={styles.container}>{breadcrumbItems}</Breadcrumb>
  );
}
