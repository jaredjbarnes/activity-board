import { EventType } from "src/models/event_type";

enum DayOfWeek {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
} 

export interface WeeklyEventType extends EventType{
  dayOfWeek: DayOfWeek;
  hour:number;
  minute: number;
  repeatEvery: number;
}