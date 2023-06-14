import { Identifier } from "../types";
import ValueList from "./ValueList";

export default class ValueListItem {
  constructor(
    public id: Identifier,
    public valueList: ValueList,
    public label: string,
  ) {
  }
}
