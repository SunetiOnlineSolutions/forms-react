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
import { id, isValidJson, toPromise, Without } from "./helpers";
import { ObjectWithID } from "./types";

export default class LocalStoragePersistence implements DataPersistence {
  protected readonly KEYS = {
    templates: "forms:formTemplates",
    versions: "forms:dataInputScreenVersions",
    sections: "forms:sections",
    questions: "forms:questions",
    answers: "forms:answers",
    forms: "forms:forms",
    valueLists: "forms:valueLists",
    valueListItems: "forms:valueListItems",
  };


  public async purgeAllData() {
    localStorage.clear();

    return new Promise<void>(resolve => resolve());
  }


  // templates

  getAllFormTemplates() {
    return toPromise(
      this.get<StoredFormTemplate[]>(this.KEYS.templates, [])
    );
  }

  storeFormTemplate(template: Without<StoredFormTemplate, "id">) {
    return toPromise(
      this.insert(this.KEYS.templates, { ...template, id: id() })
    );
  }

  updateFormTemplate(template: StoredFormTemplate) {
    return toPromise(
      this.update(this.KEYS.templates, s => s.id === template.id, template)
    );
  }

  deleteFormTemplate(template: ObjectWithID) {
    return toPromise(
      this.destroy(this.KEYS.templates, (s: ObjectWithID) => s.id === template.id)
    );
  }


  // Template Versions

  getAllFormTemplateVersions() {
    return toPromise(
      this.get<StoredFormTemplateVersion[]>(this.KEYS.versions, [])
    );
  }

  async storeFormTemplateVersion(version: Without<StoredFormTemplateVersion, "id" | "version">) {
    return toPromise(
      this.insert(this.KEYS.versions, { ...version, id: id(), version: (await this.getAllFormTemplateVersions()).length })
    );
  }

  updateFormTemplateVersion(version: StoredFormTemplateVersion) {
    return toPromise(
      this.update(this.KEYS.versions, v => v.id === version.id, version)
    );
  }

  deleteFormTemplateVersion(version: ObjectWithID) {
    return toPromise(
      this.destroy(this.KEYS.versions, (v: ObjectWithID) => v.id === version.id)
    );
  }


  // Sections

  getAllSections() {
    return toPromise(
      this.get<StoredSection[]>(this.KEYS.sections, [])
    );
  }

  async storeSection(section: Without<StoredSection, "id" | "sort_order">) {
    return toPromise(
      this.insert(this.KEYS.sections, { ...section, id: id(), sort_order: (await this.getAllSections()).length })
    );
  }

  updateSection(section: StoredSection) {
    return toPromise(
      this.update(this.KEYS.sections, s => s.id === section.id, section)
    );
  }

  bulkUpdateSections(sections: StoredSection[]) {
    // TODO: Check if this even works, as I am too lazy to test it right now.
    return toPromise(
      sections.map(section => this.update(this.KEYS.sections, s => s.id === section.id, section))
    );
  }

  reOrderSection(section: StoredSection) {
    // TODO: Also update all other sections to keep sort order consistent
    return toPromise(
      this.update(this.KEYS.sections, s => s.id === section.id, section)
    );
  }

  deleteSection(section: ObjectWithID) {
    return toPromise(
      this.destroy(this.KEYS.sections, (s: ObjectWithID) => s.id === section.id)
    );
  }


  // Questions

  getAllQuestions() {
    return toPromise(
      this.get<StoredQuestion[]>(this.KEYS.questions, [])
    );
  }

  async storeQuestion(question: Without<StoredQuestion, "id" | "sort_order">) {
    return toPromise(
      this.insert(this.KEYS.questions, { ...question, id: id(), sort_order: (await this.getAllQuestions()).length })
    );
  }

  updateQuestion(question: StoredQuestion) {
    // TODO: Also update all other sections to keep sort order consistent
    return toPromise(
      this.update(this.KEYS.questions, q => q.id === question.id, question)
    );
  }

  bulkUpdateQuestions(questions: StoredQuestion[]) {
    // TODO: Check if this even works, as I am too lazy to test it right now.
    return toPromise(
      questions.map(question => this.update(this.KEYS.questions, s => s.id === question.id, question))
    );
  }

  reOrderQuestion(question: StoredQuestion) {
    return toPromise(
      this.update(this.KEYS.questions, q => q.id === question.id, question)
    );
  }

  deleteQuestion(question: ObjectWithID) {
    return toPromise(
      this.destroy(this.KEYS.questions, (q: ObjectWithID) => q.id === question.id)
    );
  }


  // Answers

  getAllAnswers() {
    return toPromise(
      this.get<StoredAnswer[]>(this.KEYS.answers, [])
    );
  }

  storeAnswer(answer: Without<StoredAnswer, "id">) {
    return toPromise(
      this.insert(this.KEYS.answers, { ...answer, id: id() })
    );
  }

  bulkStoreAnswers(answers: Without<StoredAnswer, "id">[]) {
    return toPromise(
      this.insert(this.KEYS.answers, answers.map(a => ({ ...a, id: id() })))
    );
  };

  updateAnswer(answer: StoredAnswer) {
    return toPromise(
      this.update(this.KEYS.answers, a => a.id === answer.id, answer)
    );
  }

  deleteAnswer(answer: ObjectWithID) {
    return toPromise(
      this.destroy(this.KEYS.answers, (a: ObjectWithID) => a.id === answer.id)
    );
  }


  // Input data sets

  getAllForms() {
    return toPromise(
      this.get<StoredForms[]>(this.KEYS.forms, [])
    );
  }

  storeForm(set: Without<StoredForms, "id">) {
    return toPromise(
      this.insert(this.KEYS.forms, { ...set, id: id() })
    );
  }

  updateForm(set: StoredForms) {
    return toPromise(
      this.update(this.KEYS.forms, s => s.id === set.id, set)
    );
  }

  deleteForm(set: ObjectWithID) {
    return toPromise(
      this.destroy(this.KEYS.forms, (s: ObjectWithID) => s.id === set.id)
    );
  }


  // Value lists

  getAllValueLists() {
    return toPromise(
      this.get<StoredValueList[]>(this.KEYS.valueLists, [])
    );
  }

  storeValueList(valueList: Without<StoredValueList, "id">) {
    return toPromise(
      this.insert(this.KEYS.valueLists, { ...valueList, id: id() })
    );
  }

  updateValueList(valueList: StoredValueList) {
    return toPromise(
      this.update(this.KEYS.valueLists, v => v.id === valueList.id, valueList)
    );
  }

  deleteValueList(valueList: ObjectWithID) {
    return toPromise(
      this.destroy(this.KEYS.valueLists, (v: ObjectWithID) => v.id === valueList.id)
    );
  }


  // Value list items

  getAllValueListItems() {
    return toPromise(
      this.get<StoredValueListItem[]>(this.KEYS.valueListItems, [])
    );
  }

  storeValueListItem(item: Without<StoredValueListItem, "id">) {
    return toPromise(
      this.insert(this.KEYS.valueListItems, { ...item, id: id() })
    );
  }

  updateValueListItem(item: StoredValueListItem) {
    return toPromise(
      this.update(this.KEYS.valueListItems, i => i.id === item.id, item)
    );
  }

  deleteValueListItem(item: ObjectWithID) {
    return toPromise(
      this.destroy(this.KEYS.valueListItems, (i: ObjectWithID) => i.id === item.id)
    );
  }

  private insert<T>(key: string, toInsert: T) {
    const list = this.get<T[]>(key, []);

    if (Array.isArray(toInsert)) {
      toInsert.forEach(item => list.push(item));
    } else {
      list.push(toInsert);
    }

    this.set(key, list);

    return toInsert;
  }

  private update<T>(key: string, predicate: (item: T) => boolean, toUpdate: T) {
    const list = this.get<T[]>(key, []);

    const updatedList = list.map(item => {
      if (predicate(item)) {
        return toUpdate;
      }

      return item;
    });

    this.set(key, updatedList);

    return toUpdate;
  }

  private destroy<T>(key: string, predicate: (item: T) => boolean) {
    const list = this.get<T[]>(key, []);

    this.set(key, list.filter(elem => !predicate(elem)));
  }

  private set(key: string, value: any) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  }

  private get<Type>(key: string, defaultValue: Type): Type {
    const localstorageValue = localStorage.getItem(key);

    if (localstorageValue && isValidJson(localstorageValue)) {
      return JSON.parse(localstorageValue) as any as Type;
    }

    return defaultValue;
  }
}
