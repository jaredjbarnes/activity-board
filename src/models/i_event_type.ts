import { IMonthlyRecurringEventType } from "src/models/event_template_types/i_monthly_recurring_event_type.ts";
import { IStandardEventType } from "src/models/event_template_types/i_standard_event_type.ts";
import { IWeeklyRecurringEventType } from "src/models/event_template_types/i_weekly_recurring_event_type.ts";
import { IYearlyRecurringEventType } from "src/models/event_template_types/i_yearly_recurring_event_type.ts";

// Event type can be one of the defined types
export type IEventType =
  | IStandardEventType
  | IWeeklyRecurringEventType
  | IMonthlyRecurringEventType
  | IYearlyRecurringEventType;
