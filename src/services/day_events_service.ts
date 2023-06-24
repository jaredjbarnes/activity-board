import { WeakPromise } from "@m/hex/weak_promise";
import { EventTemplateTypesPort } from "src/services/event_template_types_port.ts";
import { Event } from "src/models/event.ts";
import { Day } from "src/models/event_template_types/day.ts";
import { EventTemplate } from "src/models/event_template.ts";

export class DayEventsService {
  private _eventsPort: EventTemplateTypesPort<Day>;

  constructor(eventsPort: EventTemplateTypesPort<Day>) {
    this._eventsPort = eventsPort;
  }

  saveEvent(template: EventTemplate<Day>): WeakPromise<EventTemplate<Day>> {
    return this._eventsPort.saveEvent(template);
  }

  deleteEvent(template: EventTemplate<Day>): WeakPromise<void> {
    return this._eventsPort.deleteEvent(template);
  }

  getEvents(startDate: Date, endDate: Date): WeakPromise<Event<Day>[]> {
    return this._eventsPort.getEvents().then((templates) => {
      const events: Event<Day>[] = [];

      for (let template of templates) {
        // If the template has been deleted
        if (template.deletedOn != null) {
          continue;
        }

        const eventDate = new Date(template.startOn);
        eventDate.setMonth(template.type.month);
        eventDate.setDate(template.type.day);
        eventDate.setHours(template.type.hour);
        eventDate.setMinutes(template.type.minute);

        if (template.type.repeatEvery === 0) {
          // If repeatEvery is 0, the event only occurs once on the startOn date
          if (eventDate.getTime() >= startDate.getTime() && eventDate.getTime() < endDate.getTime()) {
            
            const event: Event<Day> = {
              template: template,
              startTimestamp: eventDate.getTime(),
              endTimestamp: eventDate.getTime() + template.type.duration,
            };
            events.push(event);
          }
        } else {
          // Find the number of years since the startOn date
          let yearsSinceStart = startDate.getFullYear() - eventDate.getFullYear();

          // If the current year is a repeat year, calculate the event date for this year
          if (yearsSinceStart % template.type.repeatEvery === 0) {
            eventDate.setFullYear(startDate.getFullYear());

            if (eventDate.getTime() >= startDate.getTime() && eventDate.getTime() < endDate.getTime()) {
              const event: Event<Day> = {
                template: template,
                startTimestamp: eventDate.getTime(),
                endTimestamp: eventDate.getTime() + template.type.duration,
              };
              events.push(event);
            }
          }
        }
      }

      return events;
    });
  }
}