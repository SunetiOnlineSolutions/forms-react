import React from "react";
import {
  StoredAnswer,
  StoredDataInputScreen,
  StoredDataInputScreenVersion,
  StoredInputDataset,
  StoredQuestion,
  StoredSection,
  StoredValueList,
  StoredValueListItem
} from "../../DataPersistence";
import { createActions } from "./actions";
import reducer from "./reducer";
import Selectors from "./selectors";

export type DataStoreParams = {
  state: DataStore,
  actions: ReturnType<typeof createActions>,
  selectors: Selectors,
};


export const DataStore = React.createContext({}) as any as React.Context<DataStoreParams>;

export interface DataStore {
  screens: StoredDataInputScreen[],
  versions: StoredDataInputScreenVersion[],
  sections: StoredSection[],
  questions: StoredQuestion[],
  answers: StoredAnswer[],
  inputDataSets: StoredInputDataset[],
  valueLists: StoredValueList[],
  valueListItems: StoredValueListItem[],
}

export const initialState: DataStore = {
  screens: [],
  versions: [],
  sections: [],
  questions: [],
  answers: [],
  inputDataSets: [],
  valueLists: [],
  valueListItems: [],
};

export const DataStoreProvider: React.FunctionComponent = ({ children }) => {

  const [state, dispatch] = React.useReducer(reducer, { ...initialState });
  const selectors = React.useMemo(() => new Selectors(state), [state]);
  // const actions = React.useMemo(() => createActions(dispatch, selectors), [dispatch, selectors]);

  return (
    <DataStore.Provider value={{ state, selectors }}>
      {children}
    </DataStore.Provider>
  )
}
