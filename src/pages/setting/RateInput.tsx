import React, { useState } from 'react';
import { Row, Col, InputNumber } from 'antd';

interface PropsType {
  editing: boolean;
  value?: {
    in: string;
    out: string;
  };
  onChange?: (value: any) => void;
}

export default function RateInput({ editing, value, onChange }: PropsType) {
  const [inRate, setInRate] = useState(() => value?.in ?? '0.00000');
  const [outRate, setOutRate] = useState(() => value?.out ?? '0.00000');
  const onInChangeHandler = (newValue: any) => {
    setInRate(newValue);
    if (onChange) onChange({ ...value, ...{ in: newValue } });
  };
  const onOutChangeHandler = (newValue: any) => {
    setOutRate(newValue);
    if (onChange) onChange({ ...value, ...{ out: newValue } });
  };
  return (
    <Row gutter={[16, 0]} style={{ marginLeft: '30px' }}>
      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
        {editing ? (
          <InputNumber
            style={{ width: '200px' }}
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
            precision={5}
            step="1"
            stringMode
            value={inRate}
            onChange={onInChangeHandler}
          />
        ) : value?.in ? (
          parseFloat(value?.in).toFixed(5).toString()
        ) : (
          '0.00000'
        )}
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
        {editing ? (
          <InputNumber
            style={{ width: '200px' }}
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
            precision={5}
            step="1"
            stringMode
            value={outRate}
            onChange={onOutChangeHandler}
          />
        ) : value?.out ? (
          parseFloat(value?.out).toFixed(5).toString()
        ) : (
          '0.00000'
        )}
      </Col>
    </Row>
  );
}
