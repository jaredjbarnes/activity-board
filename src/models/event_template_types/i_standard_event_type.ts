import { EventTypeName } from "src/models/event_type_name.ts";

export interface IStandardEventType {
  name: EventTypeName.Standard;
  startOn: number; // In milliseconds from Unix Epoch
  endOn: number; // In milliseconds from Unix Epoch
}