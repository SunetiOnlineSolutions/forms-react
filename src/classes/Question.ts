import { QuestionOptions, StoredQuestion } from "../DataPersistence";
import { AnswerType, Identifier } from "../types";
import Answer from "./Answer";
import Section from "./Section";

export default class Question {

  constructor(
    public id: Identifier,
    public section: Section,
    public name: string,
    public answerType: AnswerType,
    public options: QuestionOptions,
    public sortOrder: number,
    public answers: Answer[],
  ) { }


  friendlyAnswerType(): string {
    return this.answerType
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\b\w/g, l => l.toUpperCase());
  }

  toStored(): StoredQuestion {
    return {
      id: this.id,
      section_id: this.section.id,
      name: this.name,
      answer_type: this.answerType,
      options: this.options,
      sort_order: this.sortOrder,
    };
  }

}
