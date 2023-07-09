import { IEventTemplate } from "src/models/i_event_template.ts";
import { IEventType } from "src/models/i_event_type.ts";

export interface IEvent<T extends IEventType> {
  template: IEventTemplate<T>;
  startTimestamp: number;
  endTimestamp: number;
}
