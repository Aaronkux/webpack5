import React from 'react';
import { Helmet } from 'umi';
import { useLocation, useHistory } from 'react-router-dom';
import store from 'store';
import PrimaryLayout from './PrimaryLayout';
import PublicLayout from './PublicLayout';
import config from '@/utils/config';
import { queryLayout } from '@/utils';

interface PropsType {
  children: React.ReactNode;
}

const LayoutMap = {
  primary: PrimaryLayout,
  public: PublicLayout,
};

export default function BasicLayout({ children }: PropsType) {
  const location = useLocation();
  const history = useHistory();
  const Container = LayoutMap[queryLayout(config.layouts, location.pathname)];
  const user = store.get('user');

  if (!user && location.pathname !== '/login') {
    console.log('blocked')
    history.replace('/login', { redirectPath: location.pathname });
  }
  if ( user && location.pathname === '/login') {
    history.replace('/');
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Global Pay System</title>
      </Helmet>
      {<Container>{children}</Container>}
    </>
  );
}
