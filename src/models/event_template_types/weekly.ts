import { EventTemplateType } from "src/models/event_template_type.ts";
import { DayOfWeek } from "src/models/event_template_types/day_of_week.ts";

export interface Weekly extends EventTemplateType {
  daysOfWeek: Set<DayOfWeek>;
  hour: number;
  minute: number;
  duration: number;
  repeatEvery: number;
}
