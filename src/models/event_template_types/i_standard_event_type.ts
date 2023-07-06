import { EventTypeName } from "src/models/event_type_name.ts";

export interface IStandardEventType {
  name: EventTypeName.Standard;
  startDate: number; // In milliseconds from Unix Epoch
  duration: number; // In milliseconds
}