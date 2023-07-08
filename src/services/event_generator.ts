import { IEvent } from "src/models/i_event.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";

export interface EventGenerator {
  generate(template: IEventTemplate, startDate: Date, endDate: Date): IEvent[];
}
