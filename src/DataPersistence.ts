import { Without } from "./helpers";
import { AnswerType, ObjectWithID, Identifier, FormVersionStatus } from "./types";

export type StoredDataInputScreen = {
  id: Identifier,
  name: string,
}

export type StoredDataInputScreenVersion = {
  id: Identifier,
  data_input_screen_id: Identifier,
  version: number,
  form_version_status: FormVersionStatus,
}

export type StoredSection = {
  id: Identifier,
  data_input_screen_version_id: Identifier,
  label: string,
  sort_order: number,
}

// TODO: Improve typing using https://stackoverflow.com/a/62530425
// TODO: Split options and validation into separate types.
//       Options could be a union of multiple types, based on the answer type.
export type QuestionOptions = {
  validation?: {
    required?: boolean,
    allowMultipleAnswers?: boolean,
    min?: number,
    max?: number,
    before?: string,
    after?: string,
    allowDecimal?: boolean,
    allowNegative?: boolean,
  },
  multipleChoice?: {
    using: 'VALUE_LIST' | 'REFERENCE_DATA' | 'CUSTOM';
    valueListID?: Identifier;
    customValues?: string[]
  },
  datetime?: {
    type: 'DATE' | 'TIME' | 'DATETIME';
  },
};

export type StoredQuestion = {
  id: Identifier,
  section_id: Identifier,
  phrase: string,
  answer_type: AnswerType,
  options: QuestionOptions,
  sort_order: number,
}

export type StoredAnswer<T = unknown> = {
  id: Identifier,
  question_id: Identifier,
  input_data_set_id: Identifier,
  value: T,
}

export type StoredInputDataset = {
  id: Identifier,
  data_input_screen_version_id: Identifier,
}

export type StoredValueList = {
  id: Identifier,
}

export type StoredValueListItem = {
  id: Identifier,
  value_list_id: Identifier,
  label: string,
}

export type StoredNewVersionResponse = StoredDataInputScreenVersion | { new_version: StoredDataInputScreenVersion, previous_version: StoredDataInputScreenVersion, sections: StoredSection[], questions: StoredQuestion[] };

export default interface DataPersistence {
  purgeAllData: () => Promise<void>;

  getAllDataInputScreens: () => Promise<StoredDataInputScreen[]>;
  storeDataInputScreen: (screen: Without<StoredDataInputScreen, "id">) => Promise<StoredDataInputScreen>;
  updateDataInputScreen: (screen: StoredDataInputScreen) => Promise<StoredDataInputScreen>;
  deleteDataInputScreen: (screen: ObjectWithID) => Promise<void>;

  getAllDataInputScreenVersions: () => Promise<StoredDataInputScreenVersion[]>;
  storeDataInputScreenVersion: (version: Without<StoredDataInputScreenVersion, "id" | "version">) => Promise<StoredNewVersionResponse>;
  updateDataInputScreenVersion: (version: StoredDataInputScreenVersion) => Promise<StoredDataInputScreenVersion>;
  deleteDataInputScreenVersion: (version: ObjectWithID) => Promise<void>;

  getAllSections: () => Promise<StoredSection[]>;
  storeSection: (section: Without<StoredSection, "id" | "sort_order">) => Promise<StoredSection>;
  updateSection: (section: StoredSection) => Promise<StoredSection>;
  bulkUpdateSections: (sections: StoredSection[]) => Promise<StoredSection[]>;
  reOrderSection: (section: StoredSection) => Promise<StoredSection>;
  deleteSection: (section: ObjectWithID) => Promise<void>;

  getAllQuestions: () => Promise<StoredQuestion[]>;
  storeQuestion: (question: Without<StoredQuestion, "id" | "sort_order">) => Promise<StoredQuestion>;
  updateQuestion: (question: StoredQuestion) => Promise<StoredQuestion>;
  bulkUpdateQuestions: (questions: StoredQuestion[]) => Promise<StoredQuestion[]>;
  reOrderQuestion: (question: StoredQuestion) => Promise<StoredQuestion>;
  deleteQuestion: (question: ObjectWithID) => Promise<void>;

  getAllAnswers: () => Promise<StoredAnswer[]>;
  storeAnswer: (answer: Without<StoredAnswer, "id">) => Promise<StoredAnswer>;
  bulkStoreAnswers: (answers: Without<StoredAnswer, "id">[]) => Promise<StoredAnswer[]>;
  updateAnswer: (answer: StoredAnswer) => Promise<StoredAnswer>;
  deleteAnswer: (answer: ObjectWithID) => Promise<void>;

  getAllInputDataSets: () => Promise<StoredInputDataset[]>;
  storeInputDataSet: (set: Without<StoredInputDataset, "id">) => Promise<StoredInputDataset>;
  updateInputDataSet: (set: StoredInputDataset) => Promise<StoredInputDataset>;
  deleteInputDataSet: (set: ObjectWithID) => Promise<void>;

  getAllValueLists: () => Promise<StoredValueList[]>;
  storeValueList: (list: Without<StoredValueList, "id">) => Promise<StoredValueList>;
  updateValueList: (list: StoredValueList) => Promise<StoredValueList>;
  deleteValueList: (list: ObjectWithID) => Promise<void>;

  getAllValueListItems: () => Promise<StoredValueListItem[]>;
  storeValueListItem: (item: Without<StoredValueListItem, "id">) => Promise<StoredValueListItem>;
  updateValueListItem: (item: StoredValueListItem) => Promise<StoredValueListItem>;
  deleteValueListItem: (item: ObjectWithID) => Promise<void>;
}
