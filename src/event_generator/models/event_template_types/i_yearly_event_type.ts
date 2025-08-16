import { IRecurringEventType } from "src/event_generator/models/event_template_types/i_recurring_event_type.ts";
import { EventTypeName } from "src/event_generator/models/event_template_types/event_type_name.ts";
import { Month } from "src/event_generator/models/month.ts";

export interface IYearlyRecurringEventType extends IRecurringEventType {
  name: EventTypeName.Yearly;
  repeatOnMonth: Month;
  repeatOnDay: number; // Day of the month (1-31)
  repeatIntervalByYear: number; // 1 meaning every year, 2 meaning every 2 years, etc.
}
