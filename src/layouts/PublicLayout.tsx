import React from 'react';
import styles from './PublicLayout.less';

interface PropsType {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PropsType) {
  return <div className={styles.container}>{children}</div>;
}
