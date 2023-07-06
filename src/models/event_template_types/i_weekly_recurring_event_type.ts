import { Days } from "src/models/days.ts";
import { IRecurringEventType } from "src/models/event_template_types/i_recurring_event_type.ts";
import { EventTypeName } from "src/models/event_type_name.ts";

export interface IWeeklyRecurringEventType extends IRecurringEventType {
  name: EventTypeName.Weekly;
  repeatOnDays: Days[];
  repeatInterval: number; // In weeks
}
