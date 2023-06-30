import { StoredFormTemplateVersion } from "../DataPersistence";
import { VersionStatusType, Identifier } from "../types";
import FormTemplate from "./FormTemplate";
import InputDataSet from "./InputDataSet";
import Section from "./Section";

export default class FormTemplateVersion {
  constructor(
    public id: Identifier,
    public formTemplate: FormTemplate,
    public inputDataSets: InputDataSet[],
    public sections: Section[],
    public version: number,
    public versionStatusType: VersionStatusType,
  ) {
  }

  toStored(): StoredFormTemplateVersion {
    return {
      id: this.id,
      form_template_id: this.formTemplate.id,
      version: this.version,
      version_status_type: this.versionStatusType,
    };
  }
}
