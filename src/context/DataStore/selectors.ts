import { DataStore } from ".";
import Answer from "../../classes/Answer";
import FormTemplate from "../../classes/FormTemplate";
import FormTemplateVersion from "../../classes/FormTemplateVersion";
import Form from "../../classes/Form";
import Question from "../../classes/Question";
import Section from "../../classes/Section";
import ValueList from "../../classes/ValueList";
import ValueListItem from "../../classes/ValueListItem";
import EntityNotFoundError from "../../errors/EntityNotFoundError";
import { Identifier } from "../../types";

/**
 * @todo Lazily construct objects when they're needed, instead of building them all upfront.
 */
export default class Selectors {
  protected tree: FormTemplate[] = [];

  constructor(protected state: DataStore) {
    this.buildTree();
  }

  public templates() {
    return this.tree;
  }

  public templateByID(id: Identifier): FormTemplate {
    const template = this.tree.find(template => template.id === id);

    if (!template) {
      throw new EntityNotFoundError();
    }

    return template;
  }

  public versions() {
    return this.tree.flatMap(s => s.versions);
  }

  public versionByID(id: Identifier): FormTemplateVersion {
    const version = this.versions()
      .find(version => version.id === id);

    if (!version) {
      throw new EntityNotFoundError();
    }

    return version;
  }

  public questionByID(id: Identifier): Question {
    const question = this.versions()
      .flatMap(version => version.sections)
      .flatMap(section => section.questions)
      .find(question => question.id === id);

    if (!question) {
      throw new EntityNotFoundError();
    }

    return question;
  }

  public sections() {
    return this.versions()
      .flatMap(version => version.sections);
  }

  public getSectionByID(id: Identifier) {
    const section = this.sections().find(s => s.id === id);

    if (!section) {
      throw new EntityNotFoundError();
    }

    return section;
  }

  public valueLists(): ValueList[] {
    return this.state.valueLists.map(stored => {
      const valueList = new ValueList(stored.id, []);

      valueList.items = this.state.valueListItems
        .filter(item => item.value_list_id === valueList.id)
        .map(item => new ValueListItem(item.id, valueList, item.name));

      return valueList;
    });
  }

  public getValueListByID(id: Identifier): ValueList {
    const valueList = this.valueLists().find(v => v.id === id);

    if (!valueList) {
      throw new EntityNotFoundError();
    }

    return valueList;
  }

  protected buildTree(): void {
    const templates = this.buildTemplates();

    templates.forEach(template => {
      template.versions = this.buildVersions(template);

      template.versions.forEach(version => {
        version.forms = this.buildForms(version);
        version.sections = this.buildSections(version);

        version.sections.forEach(section => {
          section.questions = this.buildQuestions(section);

          section.questions.forEach(question => {
            question.answers = this.state.answers
              .filter(a => a.question_id === question.id)
              .map(stored => {
                const form = version.forms.find(i => i.id === stored.form_id);

                if (!form) {
                  throw new EntityNotFoundError();
                }

                const answer = new Answer(stored.id, question, form, stored.value);

                form.answers.push(answer);

                return answer;
              });
          });
        });
      });
    });

    this.tree = templates;
  }

  protected buildTemplates(): FormTemplate[] {
    return this.state.templates
      .map(stored => new FormTemplate(stored.id, stored.name, []));
  }

  protected buildVersions(template: FormTemplate): FormTemplateVersion[] {
    return this.state.versions
      .filter(v => v.form_template_id === template.id)
      .map(stored => new FormTemplateVersion(stored.id, template, [], [], stored.version, stored.version_status_type));
  }

  protected buildSections(version: FormTemplateVersion): Section[] {
    return this.state.sections
      .filter(s => s.form_template_version_id === version.id)
      .map(stored => new Section(stored.id, stored.name, version, stored.sort_order, []));
  }

  protected buildForms(version: FormTemplateVersion): Form[] {
    return this.state.forms
      .filter(s => s.form_template_version_id === version.id)
      .map(stored => new Form(stored.id, version, []));
  }

  protected buildQuestions(section: Section): Question[] {
    return this.state.questions
      .filter(q => q.section_id === section.id)
      .map(stored => {

        const question = new Question(stored.id, section, stored.description || '', stored.name, stored.answer_type, stored.options, stored.sort_order, []);

        return question;
      });
  }
}
