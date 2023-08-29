import DataPersistence, {
  StoredAnswer,
  StoredFormTemplate,
  StoredFormTemplateVersion,
  StoredForms,
  StoredQuestion,
  StoredSection,
  StoredValueList,
  StoredValueListItem
} from "../../DataPersistence";
import { ObjectWithID } from "../../types";
import { Without } from "../../helpers";
import APIPersistence from "../../APIDataPersistence";

const storage: DataPersistence = new APIPersistence();

export const createActions = (dispatch: (param: Action) => void) => ({
  async reset() {
    await storage.purgeAllData();

    dispatch({ type: "RESET" });
  },
  templates: {
    async load() {
      const templates = await storage.getAllFormTemplates();

      dispatch({ type: "LOAD_TEMPLATES", payload: templates });
    },
    async store(template: Without<StoredFormTemplate, "id">) {
      const stored = await storage.storeFormTemplate({ name: template.name });

      dispatch({ type: "STORE_TEMPLATE", payload: stored });

      return stored;
    },
    async update(template: StoredFormTemplate) {
      const updated = await storage.updateFormTemplate({ id: template.id, name: template.name });

      dispatch({ type: "UPDATE_TEMPLATE", payload: updated });



    },
    async delete(template: ObjectWithID) {
      await storage.deleteFormTemplate(template);

      dispatch({ type: "DELETE_TEMPLATE", payload: template });
    },
  },
  versions: {
    async load() {
      const versions = await storage.getAllFormTemplateVersions();

      dispatch({ type: "LOAD_VERSIONS", payload: versions });
    },
    async store(version: Without<StoredFormTemplateVersion, "id" | "version">) {
      const stored = await storage.storeFormTemplateVersion({
        form_template_id: version.form_template_id,
        version_status_type: version.version_status_type,
      });

      if ('id' in stored) {
        dispatch({ type: "STORE_VERSION", payload: stored });

        return stored;
      }

      stored.sections.forEach(section => dispatch({ type: "STORE_SECTION", payload: section }));
      stored.questions.forEach(question => dispatch({ type: "STORE_QUESTION", payload: question }));

      return stored;
    },
    async update(version: StoredFormTemplateVersion) {
      const updated = await storage.updateFormTemplateVersion(version);

      dispatch({ type: "UPDATE_VERSION", payload: updated });
    },
    async delete(version: ObjectWithID) {
      await storage.deleteFormTemplateVersion(version);

      dispatch({ type: "DELETE_VERSION", payload: version });
    },
  },
  sections: {
    async load() {
      const sections = await storage.getAllSections();

      dispatch({ type: "LOAD_SECTIONS", payload: sections });
    },
    async store(section: Without<StoredSection, "id" | "sort_order">) {
      const stored = await storage.storeSection({
        form_template_version_id: section.form_template_version_id,
        name: section.name,
      });

      dispatch({ type: "STORE_SECTION", payload: stored });

      return stored;
    },
    async update(section: StoredSection) {
      const updated = await storage.updateSection(section);

      dispatch({ type: "UPDATE_SECTION", payload: updated });
    },
    async bulkUpdate(sections: StoredSection[]) {
      const updated = await storage.bulkUpdateSections(sections);

      dispatch({ type: "BULK_UPDATE_SECTIONS", payload: updated });


    },
    reOrder(section: StoredSection) {
      storage.reOrderSection(section);

      dispatch({ type: "REORDER_SECTION", payload: section });
    },
    async delete(section: ObjectWithID) {
      await storage.deleteSection(section);

      dispatch({ type: "DELETE_SECTION", payload: section });
    },
  },
  questions: {
    async load() {
      const questions = await storage.getAllQuestions();

      dispatch({ type: "LOAD_QUESTIONS", payload: questions });
    },
    async store(question: Without<StoredQuestion, "id" | "sort_order">) {
      const stored = await storage.storeQuestion({
        name: question.name,
        description: question.description,
        section_id: question.section_id,
        answer_type: question.answer_type,
        options: question.options,
      });

      dispatch({ type: "STORE_QUESTION", payload: stored });

      return stored;
    },
    async update(question: StoredQuestion) {
      const updated = await storage.updateQuestion({
        id: question.id,
        name: question.name,
        description: question.description,
        answer_type: question.answer_type,
        section_id: question.section_id,
        options: question.options,
        sort_order: question.sort_order,
      });

      dispatch({ type: "UPDATE_QUESTION", payload: updated });
    },
    async bulkUpdate(questions: StoredQuestion[]) {
      const updated = await storage.bulkUpdateQuestions(questions);

      dispatch({ type: "BULK_UPDATE_QUESTIONS", payload: updated });
    },
    reOrder(question: StoredQuestion) {
      storage.reOrderQuestion(question);

      dispatch({ type: "REORDER_QUESTION", payload: question });
    },
    async delete(question: ObjectWithID) {
      await storage.deleteQuestion(question);

      dispatch({ type: "DELETE_QUESTION", payload: question });
    },
  },
  answers: {
    async load() {
      const answers = await storage.getAllAnswers();

      dispatch({ type: "LOAD_ANSWERS", payload: answers });
    },
    async store(answer: Without<StoredAnswer, "id">) {
      const stored = await storage.storeAnswer({
        question_id: answer.question_id,
        form_id: answer.form_id,
        value: answer.value,
      });

      dispatch({ type: "STORE_ANSWER", payload: stored });

      return stored;
    },
    async bulkStore(answers: Without<StoredAnswer, "id">[]) {
      const stored = await storage.bulkStoreAnswers(answers);

      dispatch({ type: "BULK_STORE_ANSWERS", payload: stored });

      return stored;

    },
    async update(answer: StoredAnswer) {
      const updated = await storage.updateAnswer({
        id: answer.id,
        question_id: answer.question_id,
        form_id: answer.form_id,
        value: answer.value,
      });

      dispatch({ type: "UPDATE_ANSWER", payload: updated });
    },
    async delete(answer: ObjectWithID) {
      await storage.deleteAnswer(answer);

      dispatch({ type: "DELETE_ANSWER", payload: answer });
    },
  },
  forms: {
    async load() {
      const sets = await storage.getAllForms();

      dispatch({ type: "LOAD_INPUT_DATA_SETS", payload: sets });
    },
    async store(set: Without<StoredForms, "id">) {
      const stored = await storage.storeForm(set);

      dispatch({ type: "STORE_INPUT_DATA_SET", payload: stored });

      return stored;
    },
    async update(set: StoredForms) {
      const updated = await storage.updateForm(set);

      dispatch({ type: "UPDATE_INPUT_DATA_SET", payload: updated });
    },
    async delete(set: ObjectWithID) {
      storage.deleteForm(set);

      dispatch({ type: "DELETE_INPUT_DATA_SET", payload: set });
    },
  },
  valueLists: {
    async load() {
      const lists = await storage.getAllValueLists();

      dispatch({ type: "LOAD_VALUE_LISTS", payload: lists });
    },
    async store() {
      const stored = await storage.storeValueList({});

      dispatch({ type: "STORE_VALUE_LIST", payload: stored });

      return stored;
    },
    async update(list: StoredValueList) {
      const updated = await storage.updateValueList({ id: list.id });

      dispatch({ type: "UPDATE_VALUE_LIST", payload: updated });
    },
    async delete(list: ObjectWithID) {
      await storage.deleteValueList(list);

      dispatch({ type: "DELETE_VALUE_LIST", payload: list });
    },
  },
  valueListItems: {
    async load() {
      const items = await storage.getAllValueListItems();

      dispatch({ type: "LOAD_VALUE_LIST_ITEMS", payload: items });
    },
    async store(item: Without<StoredValueListItem, "id">) {
      const stored = await storage.storeValueListItem({
        value_list_id: item.value_list_id,
        name: item.name,
      });

      dispatch({ type: "STORE_VALUE_LIST_ITEM", payload: stored });

      return stored;
    },
    async update(item: StoredValueListItem) {
      const updated = await storage.updateValueListItem({
        id: item.id,
        value_list_id: item.value_list_id,
        name: item.name,
      });

      dispatch({ type: "UPDATE_VALUE_LIST_ITEM", payload: updated });
    },
    async delete(item: ObjectWithID) {
      await storage.deleteValueListItem(item);

      dispatch({ type: "DELETE_VALUE_LIST_ITEM", payload: item });
    },
  },
});

export type Action =
  | { type: "RESET" }

  | { type: "LOAD_TEMPLATES", payload: StoredFormTemplate[] }
  | { type: "STORE_TEMPLATE", payload: StoredFormTemplate }
  | { type: "UPDATE_TEMPLATE", payload: StoredFormTemplate }
  | { type: "DELETE_TEMPLATE", payload: ObjectWithID }

  | { type: "LOAD_VERSIONS", payload: StoredFormTemplateVersion[] }
  | { type: "STORE_VERSION", payload: StoredFormTemplateVersion }
  | { type: "UPDATE_VERSION", payload: StoredFormTemplateVersion }
  | { type: "DELETE_VERSION", payload: ObjectWithID }

  | { type: "LOAD_SECTIONS", payload: StoredSection[] }
  | { type: "STORE_SECTION", payload: StoredSection }
  | { type: "UPDATE_SECTION", payload: StoredSection }
  | { type: "BULK_UPDATE_SECTIONS", payload: StoredSection[] }
  | { type: "REORDER_SECTION", payload: StoredSection }
  | { type: "DELETE_SECTION", payload: ObjectWithID }

  | { type: "LOAD_QUESTIONS", payload: StoredQuestion[] }
  | { type: "STORE_QUESTION", payload: StoredQuestion }
  | { type: "UPDATE_QUESTION", payload: StoredQuestion }
  | { type: "BULK_UPDATE_QUESTIONS", payload: StoredQuestion[] }
  | { type: "REORDER_QUESTION", payload: StoredQuestion }
  | { type: "DELETE_QUESTION", payload: ObjectWithID }

  | { type: "LOAD_ANSWERS", payload: StoredAnswer[] }
  | { type: "STORE_ANSWER", payload: StoredAnswer }
  | { type: "BULK_STORE_ANSWERS", payload: StoredAnswer[] }
  | { type: "UPDATE_ANSWER", payload: StoredAnswer }
  | { type: "DELETE_ANSWER", payload: ObjectWithID }

  | { type: "LOAD_VALUE_LISTS", payload: StoredValueList[] }
  | { type: "STORE_VALUE_LIST", payload: StoredValueList }
  | { type: "UPDATE_VALUE_LIST", payload: StoredValueList }
  | { type: "DELETE_VALUE_LIST", payload: ObjectWithID }

  | { type: "LOAD_VALUE_LIST_ITEMS", payload: StoredValueListItem[] }
  | { type: "STORE_VALUE_LIST_ITEM", payload: StoredValueListItem }
  | { type: "UPDATE_VALUE_LIST_ITEM", payload: StoredValueListItem }
  | { type: "DELETE_VALUE_LIST_ITEM", payload: ObjectWithID }

  | { type: "LOAD_INPUT_DATA_SETS", payload: StoredForms[] }
  | { type: "STORE_INPUT_DATA_SET", payload: StoredForms }
  | { type: "UPDATE_INPUT_DATA_SET", payload: StoredForms }
  | { type: "DELETE_INPUT_DATA_SET", payload: ObjectWithID };
