import { StoredSection } from "../DataPersistence";
import { Identifier } from "../types";
import DataInputScreenVersion from "./DataInputScreenVersion";
import Question from "./Question";


export default class Section {
  constructor(
    public id: Identifier,
    public name: string,
    public version: DataInputScreenVersion,
    public sortOrder: number,
    public questions: Question[],
  ) {
  }

  toStored(): StoredSection {
    return {
      id: this.id,
      name: this.name,
      data_input_screen_version_id: this.version.id,
      sort_order: this.sortOrder,
    };
  }
}
