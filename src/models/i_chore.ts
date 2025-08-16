import { IWeekOfMonthEventType } from "src/models/event_template_types/i_week_of_month_event_type.ts";
import { IStandardEventType } from "src/models/event_template_types/i_standard_event_type.ts";
import { IDaysOfWeekEventType } from "src/models/event_template_types/i_days_of_week_event_type.ts";
import { IYearlyRecurringEventType } from "src/models/event_template_types/i_yearly_event_type.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";

export interface IChore extends IEventTemplate<IStandardEventType> {
  weight: number; // 0-1
}

export interface IMonthlyChore extends IEventTemplate<IWeekOfMonthEventType> {
  weight: number; // 0-1
}

export interface IWeeklyChore extends IEventTemplate<IDaysOfWeekEventType> {
  weight: number; // 0-1
}

export interface IYearlyChore extends IEventTemplate<IYearlyRecurringEventType> {
  weight: number; // 0-1
}