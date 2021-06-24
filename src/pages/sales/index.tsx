import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import { useRequest } from 'umi';
import { queryAllSales } from '@/services/sales';
import SalesCard from './SalesCard';
import useURLParams from '@/hooks/useURLParams';
import Edit from './Edit';
import Create from './Create';
import styles from './index.less';

const Sales = () => {
  const [visible, setVisible] = useState(false);
  const [urlState, setURL] = useURLParams();
  const [saleId, setSaleId] = useState<string>();
  const [editing, setEditing] = useState(false);

  const { data, loading, run } = useRequest(queryAllSales, {
    manual: true,
  });

  const fetchSales = () => {
    const { current = 1, pageSize = 8 } = urlState;
    run(current, pageSize);
  };

  const onChangeHandler: PaginationProps['onChange'] = (page, pageSize) => {
    setURL({ current: page.toString(), pageSize: pageSize?.toString() });
  };

  const onCardClickHandler = (id: string) => {
    setSaleId(id);
    setEditing(true);
  };
  useEffect(() => {
    fetchSales();
  }, [urlState]);

  return (
    <div className={styles.container}>
      <Row justify="end" className={styles.addBar}>
        <Button type="primary" onClick={() => setVisible(true)}>
          New
        </Button>
      </Row>
      <Row gutter={[8, 8]}>
        {data &&
          data?.data.map((sale) => (
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
          total={data?.total}
        />
      </Row>
      <Edit
        visible={editing}
        saleId={saleId}
        setSaleId={setSaleId}
        fetchSales={fetchSales}
        setEditing={setEditing}
      />
      <Create visible={visible} setVisible={setVisible} fetchSales={fetchSales} />
    </div>
  );
};

export default React.memo(Sales);
