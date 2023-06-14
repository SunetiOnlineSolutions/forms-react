import React from 'react';
import { StoredQuestion } from '../DataPersistence';

export type CurrentQuestionContextType = StoredQuestion | undefined;

const CurrentQuestionContext = React.createContext<CurrentQuestionContextType>(undefined);

export default CurrentQuestionContext;
