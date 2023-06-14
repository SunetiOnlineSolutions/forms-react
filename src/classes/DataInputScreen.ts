import { Identifier } from "../types";
import DataInputScreenVersion from "./DataInputScreenVersion";

export default class DataInputScreen {
  constructor(
    public id: Identifier,
    public name: string,
    public versions: DataInputScreenVersion[],
  ) {
  }

  latestVersion(): DataInputScreenVersion | undefined {
    if (this.versions.length === 0) {
      return;
    }

    return this.versions.reduce((a, b) => {
      if (a.version > b.version) {
        return a;
      }

      return b;
    });
  }
}
