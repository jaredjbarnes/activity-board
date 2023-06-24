import { EventTemplate } from "src/models/event_template";
import { EventTemplateType } from "src/models/event_template_type";

export interface Event<T extends EventTemplateType = EventTemplateType> {
  template: EventTemplate<T>;
  startTimestamp: number;
  endTimestamp: number;
} 