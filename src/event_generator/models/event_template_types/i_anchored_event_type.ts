import { IRecurringEventType } from "src/event_generator/models/event_template_types/i_recurring_event_type.ts";
import { EventTypeName } from "src/event_generator/models/event_template_types/event_type_name.ts";

export interface IAnchoredEventType extends IRecurringEventType {
  name: EventTypeName.Anchored;
  anchorDate: Date;
  interval: number; // In milliseconds
}