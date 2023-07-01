import { EventTemplate } from "src/models/event_template.ts";
import { EventTemplateType } from "src/models/event_template_type.ts";
import { Event } from "src/models/event.ts";

export interface EventGenerator<T extends EventTemplateType> {
  generate(
    template: EventTemplate<T>,
    startDate: Date,
    endDate: Date
  ): Event<T>[];
}
