import React from 'react';

interface PropsType {
  value?: any;
  transform?: (value?: any) => any | undefined;
}

export default function NormalText({
  value,
  transform = (value) => value,
}: PropsType) {
  return <div>{transform(value)}</div>;
}
