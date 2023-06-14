import { StoredSection } from "../DataPersistence";
import { Identifier } from "../types";
import DataInputScreenVersion from "./DataInputScreenVersion";
import Question from "./Question";


export default class Section {
  constructor(
    public id: Identifier,
    public label: string,
    public version: DataInputScreenVersion,
    public sortOrder: number,
    public questions: Question[],
  ) {
  }

  toStored(): StoredSection {
    return {
      id: this.id,
      label: this.label,
      data_input_screen_version_id: this.version.id,
      sort_order: this.sortOrder,
    };
  }
}
