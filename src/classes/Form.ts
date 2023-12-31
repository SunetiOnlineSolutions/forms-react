import { Identifier } from "../types";
import Answer from "./Answer";
import FormTemplateVersion from "./FormTemplateVersion";

export default class Form {
  constructor(
    public id: Identifier,
    public formTemplateVersion: FormTemplateVersion,
    public answers: Answer[],
  ) {
  }
}
