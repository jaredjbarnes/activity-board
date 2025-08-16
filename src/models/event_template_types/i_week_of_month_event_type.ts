import { Days } from "src/models/event_template_types/days.ts";
import { IRecurringEventType } from "src/models/event_template_types/i_recurring_event_type.ts";
import { EventTypeName } from "src/models/event_template_types/event_type_name.ts";

export interface IWeekOfMonthEventType extends IRecurringEventType {
  name: EventTypeName.WeekOfMonth;
  repeatOnDays: Days[];
  repeatOnWeek: number; // From -5 to 5 (-1 representing the last week, 1-5 representing the specific week in a month)
  repeatIntervalByMonth: number; // 1 meaning every month, 2 meaning every 2 months, etc.
}
