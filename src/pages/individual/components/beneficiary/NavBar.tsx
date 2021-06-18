import React, { useState } from 'react';
import { Menu, Tag, Skeleton, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { BeneficiaryInfo } from '@/services/clients';
import Create from './Create';
import styles from './NavBar.less';
import type { ParamsObjType } from '@/hooks/useURLParams';

interface PropsType {
  urlState: ParamsObjType;
  setURL: React.Dispatch<React.SetStateAction<ParamsObjType>>;
  data?: BeneficiaryInfo[];
  loading: boolean;
  getBeneficiaries: ()=>void
}
const NavBar = ({ urlState, setURL, data, loading, getBeneficiaries }: PropsType) => {
  const [newVisible, setNewVisible] = useState(false);
  return (
    <>
      {!loading ? (
        <Menu selectedKeys={[urlState.q?.toString()]} className={styles.subNav}>
          <div onClick={() => setNewVisible(true)} className={styles.plus}>
            <PlusOutlined />
          </div>
          {data?.map((item) => (
            <Menu.Item
              onClick={() => {
                setURL({ q: item.id });
              }}
              key={item.id}
              className={styles.menuItemContainer}
            >
              <Card
                bodyStyle={{ padding: '0' }}
                hoverable
                className={styles.navCard}
              >
                <p
                  className={styles.navCountry}
                >{`${item.country}, ${item.state}`}</p>
                <p
                  className={styles.address}
                >{`${item.address}, ${item.suburb}`}</p>
                <p className={styles.contact}>{`${item.name} ${item.phone}`}</p>
                {!item.receiverType && (
                  <Tag className={styles.selfTag} color="#f50">
                    Self
                  </Tag>
                )}
              </Card>
            </Menu.Item>
          ))}
        </Menu>
      ) : (
        <div style={{ width: '240px' }}>
          <Skeleton key={1} />
          <Skeleton key={2} />
          <Skeleton key={3} />
          <Skeleton key={4} />
        </div>
      )}
      <Create
        getBeneficiaries={getBeneficiaries}
        setURL={setURL}
        visible={newVisible}
        setNewVisible={setNewVisible}
        data={data}
      />
    </>
  );
};

export default React.memo(NavBar);
