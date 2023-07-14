import { IMonthlyRecurringEventType } from "src/models/event_template_types/i_monthly_recurring_event_type.ts";
import { IStandardEventType } from "src/models/event_template_types/i_standard_event_type.ts";
import { IWeeklyRecurringEventType } from "src/models/event_template_types/i_weekly_recurring_event_type.ts";
import { IYearlyRecurringEventType } from "src/models/event_template_types/i_yearly_recurring_event_type.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";

export interface IChore extends IEventTemplate<IStandardEventType> {
  weight: number; // 0-1
}

export interface IMonthlyChore extends IEventTemplate<IMonthlyRecurringEventType> {
  weight: number; // 0-1
}

export interface IWeeklyChore extends IEventTemplate<IWeeklyRecurringEventType> {
  weight: number; // 0-1
}

export interface IYearlyChore extends IEventTemplate<IYearlyRecurringEventType> {
  weight: number; // 0-1
}