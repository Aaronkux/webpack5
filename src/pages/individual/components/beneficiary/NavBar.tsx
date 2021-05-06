import React, { useEffect } from 'react';
import { useDispatch, useRouteMatch } from 'umi';
import type { BeneficiaryInfo } from '@/services/clients';
import { Menu, Tag, Skeleton, Divider } from 'antd';
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
  const selectedParam = urlState.q
    ? urlState.q
    : data[0]?.id?.toString() ?? null;
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
        <Menu defaultSelectedKeys={[selectedParam]} className={styles.subNav}>
          {data.map((item) => (
            <Menu.Item
              onClick={() => {
                setURL({ q: item.id });
              }}
              key={item.id}
            >
              <div className={styles.navCard}>
                <p
                  className={styles.navCountry}
                >{`${item.country}, ${item.state}`}</p>
                <p
                  className={styles.address}
                >{`${item.address}, ${item.suburb}`}</p>
                <p className={styles.contact}>{`${item.name} ${item.phone}`}</p>
                {item.receiverType ? (
                  <Tag className={styles.selfTag} color="#f50">
                    Self
                  </Tag>
                ) : (
                  ''
                )}
              </div>
              <Divider />
            </Menu.Item>
          ))}
        </Menu>
      ) : (
        <div style={{ width: '275px' }}>
          <Skeleton key={1} />
          <Skeleton key={2} />
          <Skeleton key={3} />
          <Skeleton key={4} />
        </div>
      )}
    </>
  );
};

export default React.memo(NavBar);
