import { Without } from "./helpers";
import { AnswerType, ObjectWithID, Identifier, VersionStatusType } from "./types";

export type StoredFormTemplate = {
  id: Identifier,
  name: string,
}

export type StoredFormTemplateVersion = {
  id: Identifier,
  form_template_id: Identifier,
  version: number,
  version_status_type: VersionStatusType,
}

export type StoredSection = {
  id: Identifier,
  form_template_version_id: Identifier,
  name: string,
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
  description?: string,
  section_id: Identifier,
  name: string,
  answer_type: AnswerType,
  options: QuestionOptions,
  sort_order: number,
}

export type StoredAnswer<T = unknown> = {
  id: Identifier,
  question_id: Identifier,
  form_id: Identifier,
  value: T,
}

export type StoredForms = {
  id: Identifier,
  form_template_version_id: Identifier,
}

export type StoredValueList = {
  id: Identifier,
}

export type StoredValueListItem = {
  id: Identifier,
  value_list_id: Identifier,
  name: string,
}

export type StoredNewVersionResponse = StoredFormTemplateVersion | { new_version: StoredFormTemplateVersion, previous_version: StoredFormTemplateVersion, sections: StoredSection[], questions: StoredQuestion[] };

export default interface DataPersistence {
  purgeAllData: () => Promise<void>;

  getAllFormTemplates: () => Promise<StoredFormTemplate[]>;
  storeFormTemplate: (screen: Without<StoredFormTemplate, "id">) => Promise<StoredFormTemplate>;
  updateFormTemplate: (screen: StoredFormTemplate) => Promise<StoredFormTemplate>;
  deleteFormTemplate: (screen: ObjectWithID) => Promise<void>;

  getAllFormTemplateVersions: () => Promise<StoredFormTemplateVersion[]>;
  storeFormTemplateVersion: (version: Without<StoredFormTemplateVersion, "id" | "version">) => Promise<StoredNewVersionResponse>;
  updateFormTemplateVersion: (version: StoredFormTemplateVersion) => Promise<StoredFormTemplateVersion>;
  deleteFormTemplateVersion: (version: ObjectWithID) => Promise<void>;

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

  getAllForms: () => Promise<StoredForms[]>;
  storeForm: (set: Without<StoredForms, "id">) => Promise<StoredForms>;
  updateForm: (set: StoredForms) => Promise<StoredForms>;
  deleteForm: (set: ObjectWithID) => Promise<void>;

  getAllValueLists: () => Promise<StoredValueList[]>;
  storeValueList: (list: Without<StoredValueList, "id">) => Promise<StoredValueList>;
  updateValueList: (list: StoredValueList) => Promise<StoredValueList>;
  deleteValueList: (list: ObjectWithID) => Promise<void>;

  getAllValueListItems: () => Promise<StoredValueListItem[]>;
  storeValueListItem: (item: Without<StoredValueListItem, "id">) => Promise<StoredValueListItem>;
  updateValueListItem: (item: StoredValueListItem) => Promise<StoredValueListItem>;
  deleteValueListItem: (item: ObjectWithID) => Promise<void>;
}
