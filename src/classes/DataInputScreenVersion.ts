import { StoredDataInputScreenVersion } from "../DataPersistence";
import { FormVersionStatus, Identifier } from "../types";
import DataInputScreen from "./DataInputScreen";
import InputDataSet from "./InputDataSet";
import Section from "./Section";

export default class DataInputScreenVersion {
  constructor(
    public id: Identifier,
    public dataInputScreen: DataInputScreen,
    public inputDataSets: InputDataSet[],
    public sections: Section[],
    public version: number,
    public formVersionStatus: FormVersionStatus,
  ) {
  }

  toStored(): StoredDataInputScreenVersion {
    return {
      id: this.id,
      data_input_screen_id: this.dataInputScreen.id,
      version: this.version,
      form_version_status: this.formVersionStatus,
    };
  }
}
