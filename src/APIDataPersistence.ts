import DataPersistence, {
  StoredAnswer,
  StoredFormTemplate,
  StoredFormTemplateVersion,
  StoredForms,
  StoredQuestion,
  StoredSection,
  StoredValueList,
  StoredValueListItem
} from "./DataPersistence";
import { Without } from "./helpers";
import { ObjectWithID } from "./types";

export default class APIPersistence implements DataPersistence {
  purgeAllData() {
    return new Promise<void>(() => {
      throw new Error("Purging data cannot be done via the API.");
    });
  }

  getAllFormTemplates() {
    return this.get("/api/forms/form-template");
  }

  storeFormTemplate(template: Without<StoredFormTemplate, "id">) {
    return this.post("/api/forms/form-template", template);
  }

  updateFormTemplate(template: StoredFormTemplate) {
    return this.patch(`/api/forms/form-template/${template.id}`, template);
  }

  deleteFormTemplate(template: ObjectWithID) {
    return this.delete(`/api/forms/form-template/${template.id}`);
  }

  getAllFormTemplateVersions() {
    return this.get("/api/forms/form-template-versions");
  }

  storeFormTemplateVersion(version: Without<StoredFormTemplateVersion, "id" | "version">) {
    return this.post("/api/forms/form-template-versions", version);
  }

  updateFormTemplateVersion(version: StoredFormTemplateVersion) {
    return this.patch(`/api/forms/form-template-versions/${version.id}`, version);
  }

  deleteFormTemplateVersion(version: ObjectWithID) {
    return this.delete(`/api/forms/form-template-versions/${version.id}`);
  }

  getAllSections() {
    return this.get("/api/forms/sections");
  }

  storeSection(section: Without<StoredSection, "id" | "sort_order">) {
    return this.post("/api/forms/sections", section);
  }

  updateSection(section: StoredSection) {
    return this.patch(`/api/forms/sections/${section.id}`, section);
  }

  bulkUpdateSections(sections: StoredSection[]) {
    return this.patch("/api/forms/sections/bulk", { sections })
      .then((response: { success: boolean, sections: StoredSection[] }) => response.sections);
  }

  reOrderSection(section: StoredSection) {
    return this.patch(`/api/forms/sections/${section.id}/reorder`, section);
  }

  deleteSection(section: ObjectWithID) {
    return this.delete(`/api/forms/sections/${section.id}`);
  }

  getAllQuestions() {
    return this.get("/api/forms/questions");
  }

  storeQuestion(question: Without<StoredQuestion, "id" | "sort_order">) {
    return this.post("/api/forms/questions", question);
  }

  updateQuestion(question: StoredQuestion) {
    return this.patch(`/api/forms/questions/${question.id}`, question)
  }

  bulkUpdateQuestions(questions: StoredQuestion[]) {
    return this.patch("/api/forms/questions/bulk", { questions })
      .then((response: { success: boolean, questions: StoredQuestion[] }) => response.questions);
  }

  reOrderQuestion(question: StoredQuestion) {
    return this.patch(`/api/forms/questions/${question.id}/reorder`, question)
  }

  deleteQuestion(question: ObjectWithID) {
    return this.delete(`/api/forms/questions/${question.id}`);
  }

  getAllAnswers() {
    return this.get("/api/forms/answers");
  }

  storeAnswer(answer: Without<StoredAnswer, "id">) {
    return this.post("/api/forms/answers", answer);
  }

  bulkStoreAnswers(answers: Without<StoredAnswer, "id">[]) {
    return this.post("/api/forms/answers/bulk", { answers });
  }

  updateAnswer(answer: StoredAnswer) {
    return this.patch(`/api/forms/answers/${answer.id}`, answer);
  }

  deleteAnswer(answer: ObjectWithID) {
    return this.delete(`/api/forms/answers/${answer.id}`);
  }

  getAllForms() {
    return this.get("/api/forms/forms");
  }

  storeForm(form: Without<StoredForms, "id">) {
    return this.post("/api/forms/forms", form);
  }

  updateForm(form: StoredForms) {
    return this.patch(`/api/forms/forms/${form.id}`, form);
  }

  deleteForm(form: ObjectWithID) {
    return this.delete(`/api/forms/forms/${form.id}`);
  }

  getAllValueLists() {
    return this.get("/api/forms/value-lists");
  }

  storeValueList(list: Without<StoredValueList, "id">) {
    return this.post("/api/forms/value-lists", list);
  }

  updateValueList(list: StoredValueList) {
    return this.patch(`/api/forms/value-lists/${list.id}`, list);
  }

  deleteValueList(list: ObjectWithID) {
    return this.delete(`/api/forms/value-lists/${list.id}`);
  }

  getAllValueListItems() {
    return this.get("/api/forms/value-list-items");
  }

  storeValueListItem(item: Without<StoredValueListItem, "id">) {
    return this.post("/api/forms/value-list-items", item);
  }

  updateValueListItem(item: StoredValueListItem) {
    return this.patch(`/api/forms/value-list-item/${item.id}`, item);
  }

  deleteValueListItem(item: ObjectWithID) {
    return this.delete(`/api/forms/value-list-items/${item.id}`);
  }

  protected async get(url: string) {
    const response = await fetch(
      this.prefixWithDomain(url), {headers: {"Content-Type": "application/json", "Accept": "application/json"} }
    );

    return await response.json();
  }

  protected async post(url: string, data: object) {
    const response = await fetch(
      this.prefixWithDomain(url),
      { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json", "Accept": "application/json" } }
    );

    return await response.json();
  }

  protected async patch(url: string, data: object) {
    const response = await fetch(
      this.prefixWithDomain(url),
      { method: "PATCH", body: JSON.stringify(data), headers: { "Content-Type": "application/json", "Accept": "application/json" } }
    );

    return await response.json();
  }

  protected async delete(url: string) {
    const response = await fetch(
      this.prefixWithDomain(url),
      { method: "DELETE", headers: { "Content-Type": "application/json", "Accept": "application/json" } }
    );

    return await response.json();
  }

  protected prefixWithDomain(uri: string) {
    return `${import.meta.env.VITE_APP_URL_ENV}${uri}`;
  }
}
