import React from 'react';

export interface TabProps {
  label: string;
}

const Tab: React.FunctionComponent<TabProps> = ({ children }) => {
  return <>
    {children}
  </>;
}

export default Tab;
