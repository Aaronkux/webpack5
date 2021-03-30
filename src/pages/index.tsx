import styles from './index.less';
import { Card } from 'antd';

export default function IndexPage() {
  // useEffect(()=>{
  //   request('/api/initialState').then(res => console.log(res))
  // }, [])

  return (
      <div className={styles.dev}>
        <Card className={styles.container}>
          <h1 className={styles.title}>{}</h1>
          123
        </Card>
      </div>
  );
}
