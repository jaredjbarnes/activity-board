import { EventType } from "src/models/event_type";

export interface RangeEventType extends EventType {
  startDate: number;
  endDate: number;
}