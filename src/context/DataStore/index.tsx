import React from "react";
import {
  StoredAnswer,
  StoredFormTemplate,
  StoredFormTemplateVersion,
  StoredForms,
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
  templates: StoredFormTemplate[],
  versions: StoredFormTemplateVersion[],
  sections: StoredSection[],
  questions: StoredQuestion[],
  answers: StoredAnswer[],
  forms: StoredForms[],
  valueLists: StoredValueList[],
  valueListItems: StoredValueListItem[],
}

export const initialState: DataStore = {
  templates: [],
  versions: [],
  sections: [],
  questions: [],
  answers: [],
  forms: [],
  valueLists: [],
  valueListItems: [],
};

export const DataStoreProvider = ({ children }: any) => {

  const [state, dispatch] = React.useReducer(reducer, { ...initialState });
  const selectors = React.useMemo(() => new Selectors(state), [state]);
  const actions = React.useMemo(() => createActions(dispatch), [dispatch]);

  return (
    <DataStore.Provider value={{ state, selectors, actions }}>
      {children}
    </DataStore.Provider>
  )
}
