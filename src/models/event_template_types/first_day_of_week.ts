import { EventTemplateType } from "src/models/event_template_type.ts";
import { DayOfWeek } from "src/models/event_template_types/day_of_week.ts";
import { TemplateName } from "src/models/event_template_types/template_name.ts";

export interface FirstDayOfWeek extends EventTemplateType {
  name: TemplateName.FIRST_DAY_OF_WEEK,
  daysOfWeek: DayOfWeek;
  hour: number;
  minute: number;
  duration: number;
  isAllDay: boolean;
}