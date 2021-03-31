import React from 'react'
import BasicLayout from './BasicLayout'
import './index.less'

interface PropsType {
  children: React.ReactNode;
}

export default function Layout(props: PropsType) {
  return (
    <BasicLayout>
      {props.children}
    </BasicLayout>
  )
}
