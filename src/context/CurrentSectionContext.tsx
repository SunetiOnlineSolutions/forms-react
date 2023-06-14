import React from 'react';
import { StoredSection } from '../DataPersistence';

export type CurrentSectionContextType = StoredSection | undefined;

const CurrentSectionContext = React.createContext<CurrentSectionContextType>(undefined);

export default CurrentSectionContext;
