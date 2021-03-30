import React from 'react'
import BasicLayout from './BasicLayout'

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
