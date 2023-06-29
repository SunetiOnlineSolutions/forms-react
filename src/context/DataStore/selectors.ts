import { DataStore } from ".";
import Answer from "../../classes/Answer";
import DataInputScreen from "../../classes/DataInputScreen";
import DataInputScreenVersion from "../../classes/DataInputScreenVersion";
import InputDataSet from "../../classes/InputDataSet";
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
  protected tree: DataInputScreen[] = [];

  constructor(protected state: DataStore) {
    this.buildTree();
  }

  public screens() {
    return this.tree;
  }

  public screenByID(id: Identifier): DataInputScreen {
    const screen = this.tree.find(screen => screen.id === id);

    if (!screen) {
      throw new EntityNotFoundError();
    }

    return screen;
  }

  public versions() {
    return this.tree.flatMap(s => s.versions);
  }

  public versionByID(id: Identifier): DataInputScreenVersion {
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
    const screens = this.buildScreens();

    screens.forEach(screen => {
      screen.versions = this.buildVersions(screen);

      screen.versions.forEach(version => {
        version.inputDataSets = this.buildInputDataSets(version);
        version.sections = this.buildSections(version);

        version.sections.forEach(section => {
          section.questions = this.buildQuestions(section);

          section.questions.forEach(question => {
            question.answers = this.state.answers
              .filter(a => a.question_id === question.id)
              .map(stored => {
                const inputDataSet = version.inputDataSets.find(i => i.id === stored.input_data_set_id);

                if (!inputDataSet) {
                  throw new EntityNotFoundError();
                }

                const answer = new Answer(stored.id, question, inputDataSet, stored.value);

                inputDataSet.answers.push(answer);

                return answer;
              });
          });
        });
      });
    });

    this.tree = screens;
  }

  protected buildScreens(): DataInputScreen[] {
    return this.state.screens
      .map(stored => new DataInputScreen(stored.id, stored.name, []));
  }

  protected buildVersions(screen: DataInputScreen): DataInputScreenVersion[] {
    return this.state.versions
      .filter(v => v.data_input_screen_id === screen.id)
      .map(stored => new DataInputScreenVersion(stored.id, screen, [], [], stored.version, stored.version_status_type));
  }

  protected buildSections(version: DataInputScreenVersion): Section[] {
    return this.state.sections
      .filter(s => s.data_input_screen_version_id === version.id)
      .map(stored => new Section(stored.id, stored.name, version, stored.sort_order, []));
  }

  protected buildInputDataSets(version: DataInputScreenVersion): InputDataSet[] {
    return this.state.inputDataSets
      .filter(s => s.data_input_screen_version_id === version.id)
      .map(stored => new InputDataSet(stored.id, version, []));
  }

  protected buildQuestions(section: Section): Question[] {
    return this.state.questions
      .filter(q => q.section_id === section.id)
      .map(stored => {

        const question = new Question(stored.id, section, stored.name, stored.answer_type, stored.options, stored.sort_order, []);

        return question;
      });
  }
}
