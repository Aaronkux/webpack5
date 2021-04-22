import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import { connect, useDispatch } from 'umi';
import type { SalesModelState, Loading } from 'umi';
import type { SalesInfo } from '@/services/sales';
import SalesCard from './SalesCard';
import useURLParams from '@/hooks/useURLParams';
import Edit from './Edit';
import Create from './Create';
import styles from './index.less';

interface PropsType {
  sales: SalesInfo[];
  total: number;
  loading: boolean;
}

const Sales = ({ sales, total, loading }: PropsType) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [urlState, setURL] = useURLParams();
  const [saleId, setSaleId] = useState<number>();

  const onChangeHandler: PaginationProps['onChange'] = (page, pageSize) => {
    setURL({ current: page.toString(), pageSize: pageSize?.toString() });
  };

  const onCardClickHandler = (id: number) => {
    setSaleId(id);
  };

  const onCancelHandler = () => {
    setSaleId(undefined);
  };

  useEffect(() => {
    dispatch({
      type: 'sales/queryAll',
      payload: { current: urlState.current, pageSize: urlState.pageSize },
    });
  }, [urlState]);

  return (
    <div className={styles.container}>
      <Row justify="end" className={styles.addBar}>
        <Button type="primary" onClick={() => setVisible(true)}>
          New
        </Button>
      </Row>
      <Row gutter={[8, 8]}>
        {sales.map((sale) => (
          <Col key={sale.id} xs={24} sm={12} lg={8} xl={6}>
            <SalesCard
              onCardClick={() => onCardClickHandler(sale.id)}
              loading={loading}
              salesInfo={sale}
            />
          </Col>
        ))}
      </Row>
      <Row justify="end" className={styles.pagination}>
        <Pagination
          onChange={onChangeHandler}
          showSizeChanger
          current={urlState.current ? parseInt(urlState.current) : 1}
          pageSize={urlState.pageSize ? parseInt(urlState.pageSize) : 8}
          pageSizeOptions={['4', '8', '16']}
          total={total}
        />
      </Row>
      {saleId ? <Edit saleId={saleId} onCancelHandler={onCancelHandler} /> : ''}
      <Create visible={visible} onCancelHandler={() => setVisible(false)} />
    </div>
  );
};

export default connect(
  ({ sales, loading }: { sales: SalesModelState; loading: Loading }) => ({
    sales: sales.sales,
    total: sales.total,
    loading: loading.models.sales,
  }),
)(React.memo(Sales));
