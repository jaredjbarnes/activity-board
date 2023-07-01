import { WeakPromise } from "@m/hex/weak_promise";
import { EventTemplateTypesPort } from "src/services/event_template_types_port.ts";
import { Event } from "src/models/event.ts";
import { EventTemplate } from "src/models/event_template.ts";
import { EventTemplateType } from "src/models/event_template_type.ts";

export interface EventGenerator<T extends EventTemplateType> {
  generate(
    template: EventTemplate<T>,
    startDate: Date,
    endDate: Date
  ): Event<T>[];
}

export class EventsService<T extends EventTemplateType> {
  private _eventsPort: EventTemplateTypesPort<T>;
  private _generator: EventGenerator<T>;

  constructor(
    eventsPort: EventTemplateTypesPort<T>,
    generator: EventGenerator<T>
  ) {
    this._eventsPort = eventsPort;
    this._generator = generator;
  }

  saveEvent(template: EventTemplate<T>): WeakPromise<EventTemplate<T>> {
    return this._eventsPort.saveEvent(template);
  }

  deleteEvent(template: EventTemplate<T>): WeakPromise<void> {
    return this._eventsPort.deleteEvent(template);
  }

  getEvents(startDate: Date, endDate: Date): WeakPromise<Event<T>[]> {
    return this._eventsPort.getEvents(startDate, endDate).then((templates) => {
      const events: Event<T>[] = [];

      for (let template of templates) {
        const templateEvents = this._generator.generate(
          template,
          startDate,
          endDate
        );
        events.push(...templateEvents);
      }

      return events;
    });
  }
}
