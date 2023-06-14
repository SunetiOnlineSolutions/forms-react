import { Identifier } from "../types";
import Answer from "./Answer";
import DataInputScreenVersion from "./DataInputScreenVersion";

export default class InputDataSet {
  constructor(
    public id: Identifier,
    public dataInputScreenVersion: DataInputScreenVersion,
    public answers: Answer[],
  ) {
  }
}
