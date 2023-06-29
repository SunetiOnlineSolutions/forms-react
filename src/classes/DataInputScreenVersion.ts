import { StoredDataInputScreenVersion } from "../DataPersistence";
import { VersionStatusType, Identifier } from "../types";
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
    public versionStatusType: VersionStatusType,
  ) {
  }

  toStored(): StoredDataInputScreenVersion {
    return {
      id: this.id,
      data_input_screen_id: this.dataInputScreen.id,
      version: this.version,
      version_status_type: this.versionStatusType,
    };
  }
}
