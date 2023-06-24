import { WeakPromise } from "@m/hex/weak_promise";
import { EventsPort } from "src/services/events_port";
import { Event } from "src/models/event";
import { Daily } from "src/models/event_template_types/daily";

export class DailyService {
  private _eventsPort: EventsPort<Daily>;

  constructor(eventsPort: EventsPort<Daily>) {
    this._eventsPort = eventsPort;
  }

  getEvents(startDate: Date, endDate: Date): WeakPromise<Event<Daily>[]> {
    return this._eventsPort.getEvents().then((templates) => {
      let events: Event<Daily>[] = [];

      for (let template of templates) {
        let eventDate = new Date(template.startOn);

        if (template.type.repeatEvery === 0) {
          // If repeatEvery is 0, the event only occurs once on the startOn date
          if (
            eventDate.getTime() >= startDate.getTime() &&
            eventDate.getTime() < endDate.getTime()
          ) {
            const event: Event<Daily> = {
              template: template,
              startTimestamp: eventDate.getTime(),
              endTimestamp: eventDate.getTime() + template.type.duration,
            };
            events.push(event);
          }
        } else {
          // Find the number of days since the startOn date
          let daysSinceStart = Math.floor(
            (startDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Calculate the number of days to the next occurrence of the event
          let daysToNextEvent = daysSinceStart % template.type.repeatEvery;
          if (daysToNextEvent !== 0) {
            daysToNextEvent = template.type.repeatEvery - daysToNextEvent;
          }

          // Jump directly to the next occurrence of the event
          eventDate.setDate(eventDate.getDate() + daysToNextEvent);

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
