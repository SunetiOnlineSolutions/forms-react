import { StoredAnswer } from "../DataPersistence";
import { Identifier } from "../types";
import InputDataSet from "./InputDataSet";
import Question from "./Question";

export default class Answer {
  constructor(
    public id: Identifier,
    public question: Question,
    public inputDataSet: InputDataSet,
    public value: any,
  ) {
  }

  toStoredAnswer(): StoredAnswer {
    return {
      id: this.id,
      question_id: this.question.id,
      input_data_set_id: this.inputDataSet.id,
      value: this.value,
    };
  }

  getTypedValue<T = unknown>() {
    return this.value as T;
  }

}
