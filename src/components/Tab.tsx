import React from 'react';

export interface TabProps {
  label: string,
  children?: React.ReactNode
}

const Tab: React.FunctionComponent<TabProps> = ({ children }) => {
  return <>
    {children}
  </>;
}

export default Tab;
