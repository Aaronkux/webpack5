import React, { useEffect } from 'react';
import { Divider } from 'antd';
import { useRequest, useRouteMatch } from 'umi';
import Detail from './Detail';
import NavBar from './NavBar';
import { getIndividualBeneficiaries } from '@/services/clients';
import type { ParamsObjType } from '@/hooks/useURLParams';
import styles from './index.less';

interface PropsType {
  urlState: ParamsObjType;
  setURL: React.Dispatch<React.SetStateAction<ParamsObjType>>;
}

const Beneficiary = ({ urlState, setURL }: PropsType) => {
  const match = useRouteMatch<{ id?: string }>();
  const { id } = match.params;
  const { data, loading, run: queryIndividualBeneficiaries } = useRequest(
    getIndividualBeneficiaries,
    {
      manual: true,
      onSuccess: (res) => {
        setURL({ q: res?.data[0]?.id?.toString() });
      },
    },
  );

  const getBeneficiaries = () => {
    if (id) {
      queryIndividualBeneficiaries(id);
    }
  };

  useEffect(() => {
    getBeneficiaries();
  }, [id]);

  return (
    <div className={styles.container}>
      <NavBar
        data={data?.data}
        loading={loading}
        urlState={urlState}
        setURL={setURL}
        getBeneficiaries={getBeneficiaries}
      />
      <Divider className={styles.divider} type="vertical" />
      <Detail
        urlState={urlState}
        setURL={setURL}
        getBeneficiaries={getBeneficiaries}
      />
    </div>
  );
};

export default React.memo(Beneficiary);
