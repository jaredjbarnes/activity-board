import { EventTemplate } from "src/models/event_template.ts";
import { EventTemplateType } from "src/models/event_template_type.ts";

export interface Event<T extends EventTemplateType = EventTemplateType> {
  template: EventTemplate<T>;
  startTimestamp: number;
  endTimestamp: number;
} 