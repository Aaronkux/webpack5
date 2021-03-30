import React from 'react';

interface PropsType {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PropsType) {
  return <>public{children}</>;
}
