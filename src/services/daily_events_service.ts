import { WeakPromise } from "@m/hex/weak_promise";
import { EventTemplateTypesPort } from "src/services/event_template_types_port.ts";
import { Event } from "src/models/event.ts";
import { Daily } from "src/models/event_template_types/daily.ts";
import { EventTemplate } from "src/models/event_template.ts";
import { DailyEventsGenerator } from "src/services/daily_events_generator.ts";

export class DailyEventsService {
  private _eventsPort: EventTemplateTypesPort<Daily>;

  constructor(eventsPort: EventTemplateTypesPort<Daily>) {
    this._eventsPort = eventsPort;
  }

  saveEvent(template: EventTemplate<Daily>): WeakPromise<EventTemplate<Daily>> {
    return this._eventsPort.saveEvent(template);
  }

  deleteEvent(template: EventTemplate<Daily>): WeakPromise<void> {
    return this._eventsPort.deleteEvent(template);
  }

  getEvents(startDate: Date, endDate: Date): WeakPromise<Event<Daily>[]> {
    return this._eventsPort.getEvents().then((templates) => {
      const events: Event<Daily>[] = [];

      for (let template of templates) {
        const generator = new DailyEventsGenerator(
          template,
          startDate,
          endDate
        );
        const templateEvents = generator.generate();
        events.push(...templateEvents);
      }

      return events;
    });
  }
}
