import React from 'react'

interface PropsType {
  children: React.ReactNode;
}

export default function PrimaryLayout({ children }: PropsType) {
  return <>primary{children}</>;
}
