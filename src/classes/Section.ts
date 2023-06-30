import { StoredSection } from "../DataPersistence";
import { Identifier } from "../types";
import FormTemplateVersion from "./FormTemplateVersion";
import Question from "./Question";


export default class Section {
  constructor(
    public id: Identifier,
    public name: string,
    public version: FormTemplateVersion,
    public sortOrder: number,
    public questions: Question[],
  ) {
  }

  toStored(): StoredSection {
    return {
      id: this.id,
      name: this.name,
      form_template_version_id: this.version.id,
      sort_order: this.sortOrder,
    };
  }
}
