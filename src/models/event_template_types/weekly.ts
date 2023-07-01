import { EventTemplateType } from "src/models/event_template_type.ts";

enum DayOfWeek {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export interface Weekly extends EventTemplateType {
  daysOfWeek: Set<DayOfWeek>;
  hour: number;
  minute: number;
  duration: number;
  repeatEvery: number;
}
