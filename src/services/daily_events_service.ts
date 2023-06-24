import { WeakPromise } from "@m/hex/weak_promise";
import { EventTemplateTypesPort } from "src/services/event_template_types_port.ts";
import { Event } from "src/models/event.ts";
import { Daily } from "src/models/event_template_types/daily.ts";
import { EventTemplate } from "src/models/event_template.ts";

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
        // If the template has been deleted
        if (template.deletedOn != null) {
          continue;
        }

        const eventDate = new Date(template.startOn);

        if (template.type.repeatEvery === 0) {
          // If repeatEvery is 0, the event only occurs once on the startOn date
          if (
            eventDate.getTime() >= startDate.getTime() &&
            eventDate.getTime() < endDate.getTime()
          ) {
            eventDate.setHours(template.type.hour);
            eventDate.setMinutes(template.type.minute);
            const event: Event<Daily> = {
              template: template,
              startTimestamp: eventDate.getTime(),
              endTimestamp: eventDate.getTime() + template.type.duration,
            };
            events.push(event);
          }
        } else {
          // Find the number of days since the startOn date
          const daysSinceStart = Math.floor(
            (startDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Calculate the number of days to the next occurrence of the event
          let daysToNextEvent = daysSinceStart % template.type.repeatEvery;
          if (daysToNextEvent !== 0) {
            daysToNextEvent = template.type.repeatEvery - daysToNextEvent;
          }

          // Jump directly to the next occurrence of the event
          eventDate.setDate(eventDate.getDate() + daysToNextEvent);
          eventDate.setHours(template.type.hour);
          eventDate.setMinutes(template.type.minute);

          while (eventDate.getTime() < endDate.getTime()) {
            const event: Event<Daily> = {
              template: template,
              startTimestamp: eventDate.getTime(),
              endTimestamp: eventDate.getTime() + template.type.duration,
            };
            events.push(event);

            // Jump to the next occurrence of the event
            eventDate.setDate(eventDate.getDate() + template.type.repeatEvery);
          }
        }
      }

      return events;
    });
  }
}
