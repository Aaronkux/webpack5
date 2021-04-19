import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Pagination, PaginationProps } from 'antd';
import { connect, Loading, useDispatch, useHistory, useRequest } from 'umi';
import type { SalesModelState } from 'umi';
import type { SalesInfo } from '@/services/sales';
import SalesCard from './SalesCard';
import { search2Param, param2Search } from '@/utils';
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
  const history = useHistory();
  let params = search2Param();
  const [current, setCurrent] = useState(() =>
    params.c ? parseInt(params.c) : 1,
  );
  const [size, setSize] = useState(() => (params.s ? parseInt(params.s) : 8));
  const [saleId, setSaleId] = useState<number>();

  const onChangeHandler: PaginationProps['onChange'] = (page, pageSize) => {
    setCurrent(page);
  };
  const onShowSizeChangeHandler: PaginationProps['onShowSizeChange'] = (
    current,
    size,
  ) => {
    setSize(size);
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
      payload: { current, pageSize: size },
    });
    params.c = current;
    params.s = size;
    history.replace(param2Search(params));
  }, [current, size]);

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
          onShowSizeChange={onShowSizeChangeHandler}
          showSizeChanger
          current={current}
          pageSize={size}
          pageSizeOptions={['4', '8', '16']}
          total={total}
        />
      </Row>
      {saleId ? (
        <Edit
          saleId={saleId}
          onCancelHandler={onCancelHandler}
        />
      ) : (
        ''
      )}
      <Create visible={visible} onCancelHandler={()=>setVisible(false)} />
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
