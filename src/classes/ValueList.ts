import { Identifier } from "../types";
import ValueListItem from "./ValueListItem";

export default class ValueList {
  constructor(
    public id: Identifier,
    public items: ValueListItem[]
  ) {
  }
}
