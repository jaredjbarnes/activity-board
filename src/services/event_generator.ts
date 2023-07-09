import { IEvent } from "src/models/i_event.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { IEventType } from "src/models/i_event_type.ts";

export interface EventGenerator<T extends IEventType> {
  generate(template: IEventTemplate<T>, startDate: Date, endDate: Date): IEvent<T>[];
}
