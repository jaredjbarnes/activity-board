import { WeakPromise } from "@m/hex/weak_promise";
import { EventTemplateTypesPort } from "src/services/event_template_type_port";
import { Event } from "src/models/event";
import { Weekly } from "src/models/event_template_types/weekly";

export class WeeklyEventsService {
  private _eventsPort: EventTemplateTypesPort<Weekly>;

  constructor(eventsPort: EventTemplateTypesPort<Weekly>) {
    this._eventsPort = eventsPort;
  }

  getEvents(startDate: Date, endDate: Date): WeakPromise<Event<Weekly>[]> {
    return this._eventsPort.getEvents().then((templates) => {
      let events: Event<Weekly>[] = [];

      for (let template of templates) {
        let eventDate = new Date(template.startOn * 1000);

        if (template.type.repeatEvery === 0) {
          // If repeatEvery is 0, the event only occurs once on the startOn date
          if (
            eventDate.getTime() >= startDate.getTime() &&
            eventDate.getTime() < endDate.getTime()
          ) {
            const event: Event<Weekly> = {
              template: template,
              startTimestamp: eventDate.getTime(),
              endTimestamp: eventDate.getTime() + template.type.duration,
            };
            events.push(event);
          }
        } else {
          // Find the number of weeks since the startOn date
          let weeksSinceStart = Math.floor(
            (startDate.getTime() - eventDate.getTime()) /
              (1000 * 60 * 60 * 24 * 7)
          );

          // Calculate the number of days to the next occurrence of the event
          let daysToNextEvent =
            (7 + template.type.dayOfWeek - eventDate.getDay()) % 7;
          if (weeksSinceStart % template.type.repeatEvery !== 0) {
            daysToNextEvent +=
              Math.floor(weeksSinceStart / template.type.repeatEvery) *
              template.type.repeatEvery *
              7;
          }

          // Jump directly to the next occurrence of the event
          eventDate.setDate(eventDate.getDate() + daysToNextEvent);

          while (eventDate.getTime() < endDate.getTime()) {
            const event: Event<Weekly> = {
              template: template,
              startTimestamp: eventDate.getTime(),
              endTimestamp: eventDate.getTime() + template.type.duration,
            };
            events.push(event);

            // Jump to the next occurrence of the event
            eventDate.setDate(
              eventDate.getDate() + template.type.repeatEvery * 7
            );
          }
        }
      }

      return events;
    });
  }
}
