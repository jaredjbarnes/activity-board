import { EventTemplateType } from "src/models/event_template_type";

enum DayOfWeek {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
} 

export interface Weekly extends EventTemplateType{
  name: "weekly";
  dayOfWeek: DayOfWeek;
  hour:number;
  minute: number;
  duration: number;
  repeatEvery: number;
}