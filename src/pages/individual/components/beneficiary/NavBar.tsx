import React, { useEffect, useState } from 'react';
import { useDispatch, useRouteMatch } from 'umi';
import type { BeneficiaryInfo } from '@/services/clients';
import { Menu, Tag, Skeleton, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Create from './Create';
import styles from './NavBar.less';
import type { ParamsObjType } from '@/utils';

interface PropsType {
  data: BeneficiaryInfo[];
  loading: boolean;
  urlState: ParamsObjType;
  setURL: React.Dispatch<React.SetStateAction<ParamsObjType>>;
}
const NavBar = ({ data, loading, urlState, setURL }: PropsType) => {
  const dispatch = useDispatch();
  const match = useRouteMatch<{ id?: string }>();
  const { id } = match.params;
  const selectedParam = urlState.q;
  const [newVisible, setNewVisible] = useState(false);

  useEffect(() => {
    if (!urlState?.q && data[0]?.id) {
      setURL({ q: data[0]?.id?.toString() });
    }
  }, [urlState, data]);

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'clients/getIndividualBeneficiaries',
        payload: { id },
      });
    }
  }, [id]);
  useEffect(() => {
    if (selectedParam) {
      dispatch({
        type: 'clients/getBeneficiaryDetail',
        payload: { id: selectedParam },
      });
    }
  }, [selectedParam]);
  return (
    <>
      {loading ? (
        <Menu selectedKeys={[selectedParam]} className={styles.subNav}>
          <div onClick={() => setNewVisible(true)} className={styles.plus}>
            <PlusOutlined />
          </div>
          {data.map((item) => (
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
                {item.receiverType && (
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
        setURL={setURL}
        visible={newVisible}
        setNewVisible={setNewVisible}
      />
    </>
  );
};

export default React.memo(NavBar);
