import { EventTemplate } from "src/models/event_template.ts";
import { Event } from "src/models/event.ts";
import { Range } from "src/models/event_template_types/range.ts";

export class RangeEventsGenerator {
  generate(
    template: EventTemplate<Range>,
    startDate: Date,
    endDate: Date
  ): Event<Range>[] {
    const events = [];
    // If the range of the event intersects with the start and end dates
    if (
      (template.type.startTimestamp <= endDate.getTime() &&
        template.type.startTimestamp >= startDate.getTime()) ||
      (template.type.endTimestamp <= endDate.getTime() &&
        template.type.endTimestamp >= startDate.getTime()) ||
      (template.type.startTimestamp <= startDate.getTime() &&
        template.type.endTimestamp >= endDate.getTime())
    ) {
      const event: Event<Range> = {
        template: template,
        startTimestamp: template.type.startTimestamp,
        endTimestamp: template.type.endTimestamp,
      };
      events.push(event);
    }

    return events;
  }
}
