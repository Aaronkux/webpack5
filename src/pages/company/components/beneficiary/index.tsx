import React, { useEffect } from 'react';
import { Divider, Skeleton } from 'antd';
import { useRequest, useRouteMatch } from 'umi';
import Detail from './Detail';
import NavBar from './NavBar';
import {
  getCompanyBeneficiaries,
  getBeneficiaryDetail,
} from '@/services/clients';
import type { ParamsObjType } from '@/hooks/useURLParams';
import styles from './index.less';

interface PropsType {
  urlState: ParamsObjType;
  setURL: React.Dispatch<React.SetStateAction<ParamsObjType>>;
}

const Beneficiary = ({ urlState, setURL }: PropsType) => {
  const match = useRouteMatch<{ id?: string }>();
  const { id } = match.params;
  const { data, loading, run: queryCompanyBeneficiaries } = useRequest(
    getCompanyBeneficiaries,
    {
      manual: true,
      onSuccess: (res) => {
        setURL({ q: res?.data[0]?.id?.toString() });
      },
      formatResult: (res) => {
        let temp = res.data;
        if (temp?.data) {
          temp.data = res?.data?.data.reverse() ?? [];
        }
        return temp;
      },
    },
  );

  const getBeneficiaries = () => {
    if (id) {
      queryCompanyBeneficiaries(id);
    }
  };

  const { data: detailData, loading: detailLoading, run } = useRequest(
    getBeneficiaryDetail,
    {
      manual: true,
    },
  );

  const queryBeneficiaryDetail = () => {
    if (urlState.q) {
      run(urlState.q);
    }
  };

  useEffect(() => {
    queryBeneficiaryDetail();
  }, [urlState.q]);

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
      {detailLoading ? (
        <Skeleton paragraph={{ rows: 10 }} />
      ) : detailData ? (
        <Detail
          data={detailData}
          clientId={id}
          allBeneficiaryIds={data?.data.map(val=>val.id) ?? []}
          queryBeneficiaryDetail={queryBeneficiaryDetail}
          getBeneficiaries={getBeneficiaries}
        />
      ) : (
        <div className={styles.emptyBeneficiaryContent}>
          You Haven't Create Any Beneficiary Yet
        </div>
      )}
    </div>
  );
};

export default React.memo(Beneficiary);
