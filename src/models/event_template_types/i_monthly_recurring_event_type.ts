import { Days } from "src/models/days.ts";
import { IRecurringEventType } from "src/models/event_template_types/i_recurring_event_type.ts";
import { EventTypeName } from "src/models/event_type_name.ts";

export interface IMonthlyRecurringEventType extends IRecurringEventType {
  name: EventTypeName.Monthly;
  repeatOnDays: Days[];
  repeatOnWeekNumber: number; // From -1 to 5 (-1 representing the last week, 1-5 representing the specific week in a month)
}
