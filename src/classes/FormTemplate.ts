import { Identifier } from "../types";
import FormTemplateVersion from "./FormTemplateVersion";

export default class FormTemplate {
  constructor(
    public id: Identifier,
    public name: string,
    public versions: FormTemplateVersion[],
  ) {
  }

  latestVersion(): FormTemplateVersion | undefined {
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
