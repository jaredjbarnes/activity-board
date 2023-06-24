import { WeakPromise } from "@m/hex/weak_promise";
import { EventTemplateTypesPort } from "src/services/event_template_types_port.ts";
import { Event } from "src/models/event.ts";
import { Range } from "src/models/event_template_types/range.ts";
import { EventTemplate } from "src/models/event_template.ts";

export class RangeEventsService {
  private _eventsPort: EventTemplateTypesPort<Range>;

  constructor(eventsPort: EventTemplateTypesPort<Range>) {
    this._eventsPort = eventsPort;
  }

  saveEvent(template: EventTemplate<Range>): WeakPromise<EventTemplate<Range>> {
    return this._eventsPort.saveEvent(template);
  }

  deleteEvent(template: EventTemplate<Range>): WeakPromise<void> {
    return this._eventsPort.deleteEvent(template);
  }

  getEvents(startDate: Date, endDate: Date): WeakPromise<Event<Range>[]> {
    return this._eventsPort.getEvents().then((templates) => {
      let events: Event<Range>[] = [];

      for (let template of templates) {
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
      }

      return events;
    });
  }
}
