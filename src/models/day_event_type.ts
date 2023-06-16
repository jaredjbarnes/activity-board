import { EventType } from "src/models/event_type";

export interface DayEvenType extends EventType {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  repeatEvery: number; 
}