import { StoredAnswer } from "../DataPersistence";
import { Identifier } from "../types";
import Form from "./Form";
import Question from "./Question";

export default class Answer {
  constructor(
    public id: Identifier,
    public question: Question,
    public form: Form,
    public value: any,
  ) {
  }

  toStoredAnswer(): StoredAnswer {
    return {
      id: this.id,
      question_id: this.question.id,
      form_id: this.form.id,
      value: this.value,
    };
  }

  getTypedValue<T = unknown>() {
    return this.value as T;
  }

}
