import React from 'react';
import { connect } from 'umi';
import type { ClientsModelState, Loading } from 'umi';
import type { BeneficiaryInfo } from '@/services/clients';
import { Divider, Skeleton } from 'antd';
import Detail from './Detail';
import NavBar from './NavBar';
import type { ParamsObjType } from '@/hooks/useURLParams';
import styles from './index.less';

interface PropsType {
  beneficiary: BeneficiaryInfo[];
  beneficiaryDetail?: BeneficiaryInfo;
  beneficiaryLoading: boolean;
  beneficiaryDetailLoading: boolean;
  urlState: ParamsObjType;
  setURL: React.Dispatch<React.SetStateAction<ParamsObjType>>;
}

const Beneficiary = ({
  beneficiary,
  beneficiaryDetail,
  beneficiaryLoading,
  beneficiaryDetailLoading,
  urlState,
  setURL,
}: PropsType) => {
  return (
    <div className={styles.container}>
      <NavBar
        urlState={urlState}
        setURL={setURL}
        data={beneficiary}
        loading={!beneficiaryLoading && beneficiary.length > 0}
      />
      <Divider className={styles.divider} type="vertical" />
      {beneficiary.length > 0 &&
      !beneficiaryDetailLoading &&
      beneficiaryDetail !== undefined ? (
        <Detail setURL={setURL} data={beneficiaryDetail!} />
      ) : (
        <Skeleton paragraph={{ rows: 10 }} />
      )}
    </div>
  );
};

export default connect(
  ({ clients, loading }: { clients: ClientsModelState; loading: Loading }) => ({
    beneficiary: clients.beneficiary,
    beneficiaryDetail: clients.beneficiaryDetail,
    beneficiaryLoading: loading.effects['clients/getCompanyBeneficiaries']!,
    beneficiaryDetailLoading: loading.effects['clients/getBeneficiaryDetail']!,
  }),
)(React.memo(Beneficiary));
