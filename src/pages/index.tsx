import styles from './index.less';
import { Card } from 'antd';
import BasicLayout from '@/layouts/BasicLayout';
import { useModel, request, useRequest } from 'umi';
import { useEffect } from 'react';

export default function IndexPage() {
  // useEffect(()=>{
  //   request('/api/initialState').then(res => console.log(res))
  // }, [])

  return (
    <BasicLayout>
      <div className={styles.dev}>
        <Card className={styles.container}>
          <h1 className={styles.title}>{}</h1>
          123
          {/* <>{loading ? 'loading...' : initialState.users[0]}</> */}
        </Card>
      </div>
    </BasicLayout>
  );
}
