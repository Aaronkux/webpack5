import React from 'react';
import useURLParams from '@/hooks/useURLParams';
import { Menu, Tag } from 'antd';
import styles from './NavBar.less';

let mockData: any[] = [];

for (let i = 0; i < 10; i++) {
  mockData.push({
    key: i.toString(),
    name: 'aaron',
    type: 0,
    address: `${i} test Rd asd, ppararmtata`,
    suburb: 'Burwood',
    state: 'NSW',
    country: 'Australia',
    phone: '0401836846',
  });
}
export default function NavBar() {
  const [urlState, setURL] = useURLParams();
  const selectedParam = urlState.q
    ? urlState.q
    : mockData[0]?.key?.toString() ?? null;
  return (
    <>
      <Menu defaultSelectedKeys={[selectedParam]} className={styles.subNav}>
        {mockData.map((item) => (
          <Menu.Item
            onClick={() => {
              setURL({ q: item.key });
            }}
            key={item.key}
          >
            <div className={styles.navCard}>
              <p
                className={styles.navCountry}
              >{`${item.country}, ${item.state}`}</p>
              <p
                className={styles.address}
              >{`${item.address}, ${item.suburb}`}</p>
              <p className={styles.contact}>{`${item.name} ${item.phone}`}</p>
              {item.type === 0 ? (
                <Tag className={styles.selfTag} color="#f50">
                  Self
                </Tag>
              ) : (
                ''
              )}
            </div>
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
}
