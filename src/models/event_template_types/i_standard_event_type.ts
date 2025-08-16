import { EventTypeName } from "src/models/event_template_types/event_type_name.ts";
import { IEventType } from "src/models/i_event_type.ts";

export interface IStandardEventType extends IEventType {
  name: EventTypeName.Standard;
  startOn: number; // In milliseconds from Unix Epoch
  duration: number; // In milliseconds
}
