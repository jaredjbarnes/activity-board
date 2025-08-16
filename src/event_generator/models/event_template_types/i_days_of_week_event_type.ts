import { Days } from "src/event_generator/models/event_template_types/days.ts";
import { IRecurringEventType } from "src/event_generator/models/event_template_types/i_recurring_event_type.ts";
import { EventTypeName } from "src/event_generator/models/event_template_types/event_type_name.ts";

export interface IDaysOfWeekEventType extends IRecurringEventType {
  name: EventTypeName.DayOfWeek;
  repeatOnDays: Days[];
  repeatIntervalByWeek: number; // 1 meaning every week, 2 meaning every 2 weeks, etc.
}
