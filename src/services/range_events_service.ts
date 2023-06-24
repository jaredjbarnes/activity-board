import { WeakPromise } from "@m/hex/weak_promise";
import { EventsPort } from "src/services/events_port";
import { Event } from "src/models/event";
import { Range } from "src/models/event_template_types/range";

export class RangeService {
  private _eventsPort: EventsPort<Range>;

  constructor(eventsPort: EventsPort<Range>) {
    this._eventsPort = eventsPort;
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
