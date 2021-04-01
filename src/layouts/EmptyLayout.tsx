import React from 'react'


interface PropsType {
  children: React.ReactNode;
}

export default function EmptyLayout(props: PropsType) {
  return (
    <>
      {props.children}
    </>
  )
}
