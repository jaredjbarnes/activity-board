import { EventType } from "src/models/event_type";

export interface DailyEvenType extends EventType {
  hour: number;
  minute: number;
  repeatEvery: number;
  isAllDay: boolean;
}