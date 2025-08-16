import { IRecurringEventType } from "src/event_generator/models/event_template_types/i_recurring_event_type.ts";
import { EventTypeName } from "src/event_generator/models/event_template_types/event_type_name.ts";
import { Months } from "src/event_generator/models/months.ts";

export interface IYearlyRecurringEventType extends IRecurringEventType {
  name: EventTypeName.Yearly;
  repeatOnMonth: Months;
  repeatOnDay: number; // Day of the month (1-31)
  repeatIntervalByYear: number; // 1 meaning every year, 2 meaning every 2 years, etc.
}
